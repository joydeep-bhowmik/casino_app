<?php

namespace App\Http\Controllers\Games;

use App\Models\Game;
use App\Models\User;
use App\Models\Round;

use App\Http\Controllers\Controller;

class CrashGameController extends Controller
{
    private $uid = 'crash';

    public function __construct(public int $bet, public int $user_id)
    {
    }

    function _validate(array $arr)
    {
        $object = (object)$arr;

        if (!$object->user) {
            return $this->error('Login to play');
        }

        if (!$object->game) {
            return $this->error('Invalid game');
        }

        if (!$this->bet) return $this->error('Invalid bet');

        if ($this->bet > $object->user->balanceInt) {
            return $this->error('Insufficient funds');
        }
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

        $round->multiplier = 0.1;

        $round->game_data = json_encode($game_data);

        if ($round->save()) {
            $user->withdraw($this->bet);
            return ['success' => [
                'round_id' => $round->id,
                'message' => 'Round Started'
            ]];
        }
    }


    function configure()
    {

        return [
            'bet' => $this->bet,
            'crash_at' => mt_rand(1, 10) / 10

        ];
    }




    static function check(int $number, $round_id, $user_id)
    {
        $user = User::find($user_id);

        if (!$user) return;

        $round = Round::where('id', $round_id)->where('user_id', $user->id)->first();

        if (!$round || $round->status == 'finished') return ['info' => 'Round  finished'];

        $data = (object) json_decode($round->game_data);


        if ($data->crash_at > $number) {

            $round->multiplier + 0.1;

            $round->game_data = json_encode($data);

            $round->save();

            return ['keep' => $round->multiplier];
        }

        if ($data->crash_at <= $number) {

            $round->multiplier = 0;

            $round->game_data = json_encode($data);

            $round->status = "finished";

            $round->save();

            return ['crash' => 1];
        }
        return ['hhe' => 'sss'];
    }

    static function cashout($round_id, $user_id)
    {
        $user = User::find($user_id);

        if (!$user) return;

        $round = Round::where('id', $round_id)->where('user_id', $user->id)->first();

        if (!$round || $round->status == 'finished') return ['info' => 'Round  finished'];

        $data = (object) json_decode($round->game_data);

        $cashout = (int) $data->bet + $data->bet * $round->multiplier;

        if ($cashout) {

            $user->deposit($cashout);

            return ['cashout' => ['message' => $cashout . ' points recieved', 'balance' => $user->balanceint]];
        }
    }

    function error($msg)
    {
        return ['error' => $msg];
    }
}
