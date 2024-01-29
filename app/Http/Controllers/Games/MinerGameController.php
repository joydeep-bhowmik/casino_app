<?php

namespace App\Http\Controllers\Games;

use App\Models\Game;
use App\Models\User;
use App\Models\Round;

use App\Http\Controllers\Controller;

class MinerGameController extends Controller
{
    private $uid = 'miner';
    public $gems;
    public $multiplier;
    public int $number_of_tiles = 25;

    public function __construct(public int $bet, public int $mines, public  $user_id)
    {
    }

    function start()
    {
        $game = Game::where('uid', $this->uid)->first();

        $user = User::find($this->user_id);


        $error = $this->_validate([
            'game' => $game,
            'user' => $user
        ]);
        if ($error) {
            return $error;
        }




        $game_data = $this->configure();

        $round = new Round();

        $round->user_id = $user->id;

        $round->game_id = $game->id;

        $round->status = 'started';

        $round->multiplier = $this->multiplier;

        $round->game_data = json_encode($game_data);

        if ($round->save()) {
            $user->withdraw($this->bet);
            return ['success' => $round->id];
        }
    }



    public function configure(): array
    {
        // Calculate the number of gems
        $this->gems = (int)($this->number_of_tiles - $this->mines);

        // Calculate the multiplier
        $this->multiplier = 1 / $this->gems;

        // Generate the tiles array
        $tiles = range(1, $this->number_of_tiles);

        // Shuffle the tiles array
        shuffle($tiles);

        // Split tiles into mines and gems
        $mines = array_slice($tiles, 0, $this->mines);
        $gems = array_slice($tiles, $this->mines);

        // Return the configuration
        return [
            'bet' => $this->bet, // Changed uid to bet
            'number_of_mines' => $this->mines,
            'number_of_gems' => $this->gems,
            'mines' => $mines,
            'gems' => $gems,
            'collected_gems' => [],
        ];
    }

    function _validate(array $arr)
    {
        $object = (object)$arr;

        if (!$object->game) return $this->error('Invalid game');

        if (!$object->user) return $this->error('Invalid user');

        if ($this->mines + $this->gems > $this->number_of_tiles) {
            return $this->error('Invalid mines');
        }
        if ($this->bet > $object->user->balanceInt) {
            return $this->error('Insufficient funds');
        }
    }


    static function check(int $number, $round_id, $user_id)
    {
        $user = User::find($user_id);

        if (!$user) return;

        $round = Round::where('id', $round_id)->where('user_id', $user->id)->first();

        if (!$round || $round->status == 'finished') return ['info' => 'Round Already finished'];

        $data = (object) json_decode($round->game_data);

        if (count($data->collected_gems) == count($data->gems)) {
            return ['info' => 'all_gems_collected'];
        }

        if (in_array($number, $data->gems)) {

            array_push($data->collected_gems, $number);

            $data->collected_gems = array_unique($data->collected_gems);

            $round->game_data = json_encode($data);

            $round->save();

            return ['block' => [
                'type' => 'gem',
                'number' => $number
            ]];
        }

        if (in_array($number, $data->mines)) {

            $multiplier = count($data->collected_gems) * $round->multiplier;

            $payout = (int)($data->bet + ($data->bet * $multiplier));

            $round->status = 'finished';

            $round->payout = $payout;

            $user->deposit($payout);

            $round->save();

            return ['block' => [
                'type' => 'mine',
                'number' => $number,
                'reveal_mines' => $data->mines,
                'payout' => $round->payout . ' points collected',
            ]];
        }
    }

    function error($msg)
    {
        return ['error' => $msg];
    }
}
