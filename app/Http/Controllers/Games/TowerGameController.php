<?php

namespace App\Http\Controllers\Games;

use App\Models\Game;
use App\Models\User;
use App\Models\Round;

use App\Http\Controllers\Controller;

class TowerGameController extends Controller
{
    private $uid = 'tower';

    public int $number_of_tiles = 27;

    public $multiplier = 0.5;

    public function __construct(public int $bet, public int $user_id)
    {
    }

    function _validate(array $arr)
    {
        $object = (object)$arr;

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
        $column1 = [];
        $column2 = [];
        $column3 = [];
        $main_array = range(1, 9);

        shuffle($main_array);

        $column1 = array_slice($main_array, 0, 3);
        sort($column1);

        $column2 = array_slice($main_array, 3, 3);
        sort($column2);

        $column3 = array_slice($main_array, 6, 3);
        sort($column3);

        return [
            'bet' => $this->bet,
            'collected_green_boxes' => [],
            'collected_numbers' => [],
            'last_row' => 0,
        ];
    }




    static function check(int $number, $round_id, $user_id)
    {
        $user = User::find($user_id);

        if (!$user) return;

        $round = Round::where('id', $round_id)->where('user_id', $user->id)->first();

        if (!$round || $round->status == 'finished') return ['info' => 'Round  finished'];

        $data = (object) json_decode($round->game_data);

        $row_number = self::getRowNumber($number);



        if (!$data->last_row &&  $row_number != 1) {
            return ['error' => 'Select row from current row:' . $row_number  . 'last row' . $data->last_row];
        }
        if ($data->last_row &&  $row_number != $data->last_row + 1) {
            return ['error' => 'Select row in order current row:' . $row_number  . 'last row' . $data->last_row];
        }
        $data->last_row = $row_number;

        $round->game_data = json_encode($data);

        $round->save();

        array_push($data->collected_numbers, $number);

        $data->collected_numbers = $data->collected_numbers;

        $round->game_data = json_encode($data);

        $round->save();

        if ($round->status == 'finished') {


            return ['info' => 'Round finished'];
        }



        if ($number == rand(self::getLowestValueInRow($row_number), self::getHighestValueInRow($row_number))) {

            array_push($data->collected_green_boxes, $number);

            $data->collected_green_boxes = array_unique($data->collected_green_boxes);

            $round->game_data = json_encode($data);

            $round->save();

            return ['block' => [
                'type' => 'green',
                'number' => $number
            ]];
        } else {

            $multiplier = 1 * $round->multiplier;

            $payout = (int)($data->bet + ($data->bet * $multiplier));

            $round->status = 'finished';

            $round->payout = $payout;

            $user->deposit($payout);

            $round->save();


            return ['block' => [
                'type' => 'red',
                'number' => $number
            ]];
        }
    }

    static function getRowNumber($boxNumber, $totalColumns = 3)
    {
        return ceil($boxNumber / $totalColumns);
    }

    static function getLowestValueInRow($rowNumber, $totalColumns = 3)
    {
        return ($rowNumber - 1) * $totalColumns + 1;
    }

    static function getHighestValueInRow($rowNumber, $totalColumns = 3)
    {
        return $rowNumber * $totalColumns;
    }

    function error($msg)
    {
        return ['error' => $msg];
    }
}
