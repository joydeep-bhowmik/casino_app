<?php

namespace App\Http\Controllers\Games;

use App\Models\Game;
use App\Models\User;
use App\Models\Round;

use App\Http\Controllers\Controller;

class KenoGameController extends Controller
{
    private $uid = 'keno';

    private array $tiles;

    private int $number_of_gems;

    private array $green_boxes;

    private array $gems;

    private int $number_of_green_boxes;

    public $multiplier;

    public int $number_of_tiles = 40;



    public function __construct(public int $bet, public string $risk, public int $user_id)
    {
    }

    function _validate(array $arr)
    {
        $object = (object)$arr;

        if (!$object->game) return $this->error('Invalid game');

        if (!$object->user) return $this->error('Invalid user');

        if (!$this->bet) return $this->error('Invalid bet');

        if (!$this->risk || !in_array($this->risk, ['low', 'medium', 'high'])) {

            return $this->error('Invalid risk');
        }

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

        $round->multiplier = $this->multiplier;

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
        $this->tiles = range(1, $this->number_of_tiles);

        switch ($this->risk) {
            case 'low':
                $this->number_of_gems = rand(1, 4);
                $this->number_of_green_boxes = 30;
            case 'medium':
                $this->number_of_gems =  rand(4, 8);
                $this->number_of_green_boxes = 20;

            case 'high':
                $this->number_of_gems = rand(8, 12);
                $this->number_of_green_boxes = 12;
        }

        $this->multiplier = (1 / $this->number_of_green_boxes) * 100;

        shuffle($this->tiles);

        $this->green_boxes = array_slice($this->tiles, 0, $this->number_of_green_boxes - 1);

        $this->gems = array_slice($this->green_boxes, 0, $this->number_of_gems  - 1);

        return [
            'bet' => $this->bet,
            'green_boxes' => $this->green_boxes,
            'gems' => $this->gems,
            'number_of_gems' => $this->number_of_gems,
            'number_of_red_boxs' => (int) $this->number_of_tiles - $this->number_of_green_boxes,
            'collected_gems' => [],
            'collected_green_boxes' => [],
            'collected_numbers' => []
        ];
    }




    static function check(int $number, $round_id, $user_id)
    {
        $user = User::find($user_id);

        if (!$user) return;

        $round = Round::where('id', $round_id)->where('user_id', $user->id)->first();

        if (!$round || $round->status == 'finished') return ['info' => 'Round  finished'];

        $data = (object) json_decode($round->game_data);

        array_push($data->collected_numbers, $number);

        $data->collected_numbers = array_unique($data->collected_numbers);

        $round->game_data = json_encode($data);

        $round->save();

        if (count($data->collected_numbers) >= 10) {

            $multiplier = count($data->collected_gems) * $round->multiplier;

            $payout = (int)($data->bet + ($data->bet * $multiplier));

            $round->status = 'finished';

            $round->payout = $payout;

            $user->deposit($payout);

            $round->save();

            return ['finished' => [
                'message' => 'Game over',
                'payout' => $round->payout . ' points collected',
                'balance' => $user->balanceInt,
            ]];
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

        if (in_array($number, $data->green_boxes)) {

            array_push($data->collected_green_boxes, $number);

            $data->collected_green_boxes = array_unique($data->collected_green_boxes);

            $round->game_data = json_encode($data);

            $round->save();

            return ['block' => [
                'type' => 'green',
                'number' => $number
            ]];
        }

        if (!in_array($number, $data->gems) || !in_array($number, $data->green_boxes)) {

            return ['block' => [
                'type' => 'red',
                'number' => $number
            ]];
        }
    }

    function error($msg)
    {
        return ['error' => $msg];
    }
}
