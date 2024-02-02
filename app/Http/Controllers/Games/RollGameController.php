<?php

namespace App\Http\Controllers\Games;

use App\Models\Game;
use App\Models\User;
use App\Models\Round;
use App\Http\Controllers\Controller;

class RollGameController extends Controller
{

    private $uid = 'roll';

    private $min_betting_amount = 22;

    private array $probabilities = [
        'axe' => 0.01, // Lowest probability
        'tent' => 0.2,
        'meat' => 0.2,
        'lost' => 0.59
    ];

    private array $multipliers = [
        'axe' => 14, // Lowest probability
        'tent' => 2,
        'meat' => 2,
        'lost' => 0
    ];

    public function __construct(public int $bet, public string $item, public  $user_id)
    {
    }

    function start()
    {
        $game = Game::where('uid', $this->uid)->first();

        $user = User::find($this->user_id);

    


        $error = $this->_validate([
            'game' => $game,
            'user' => $user,
            'item' => $this->item,
        ]);

        if ($error) {
            return $error;
        }

        $game_data = $this->configure();

        $round = new Round();

        $round->user_id = $user->id;

        $round->game_id = $game->id;

        $round->status = 'started';


        $round->game_data = json_encode($game_data);

        if ($round->save()) {

            $game_data = (object) $game_data;

            $user->withdraw($this->bet);


            if ($game_data->bet_on_item == $game_data->result) {


                $round->multiplier = $this->multipliers[$game_data->bet_on_item];

                $payout = $this->bet + ($this->bet * $round->multiplier);

                $round->payout = $payout;

                $user->deposit($payout);
            }


            $round->status = 'finished';

            $round->save();

            return [
                'success' => [
                    'balance' => $user->balanceInt,
                    'round_id' => $round->id,
                    'result' => $game_data->result == 'lost' ? $this->fake_results($game_data->bet_on_item) : $game_data->result,
                    'message' => 'Round started',
                    'payout' => $round->payout,
                    'status' => $game_data->bet_on_item == $game_data->result ? "won" : "lost"
                ]
            ];
        }

        return $this->error('something went wrong');
    }



    public function configure(): array
    {

        return [
            'bet' => $this->bet,
            'bet_on_item' => $this->item,
            'result' => $this->get_rand_item()
        ];
    }

    function _validate(array $arr)
    {
        $object = (object)$arr;

        if (!$object->game) return $this->error('Invalid game');

        if (!$object->user) return $this->error('Invalid user');

        if ($this->bet > $object->user->balanceInt) {
            return $this->error('Insufficient funds');
        }
        if ($this->bet < $this->min_betting_amount) {
            return $this->error('Minimum betting amount is ' . $this->min_betting_amount);
        }

        if (!in_array($this->item, array_keys($this->probabilities))) {

            return $this->error('Invalid item selection');
        }
    }


    private function get_rand_item()
    {
        $result = null;
        // Generate a random number
        $random = mt_rand() / mt_getrandmax();

        // Iterate through the probabilities and select the element
        $sum = 0;
        foreach ($this->probabilities as $element => $probability) {
            $sum += $probability;
            if ($random <= $sum) {
                $result = $element;
                break;
            }
        }

        return $result;
    }

    private function fake_results($excludeValue)
    {
        $og_arr = $this->probabilities;

        unset($og_arr['lost']);

        $array = array_keys($og_arr);



        $filteredArray = array_filter($array, function ($value) use ($excludeValue) {
            return $value !== $excludeValue;
        });
        $randomKey = array_rand($filteredArray);
        // Select any other value randomly
        $randomValue = $filteredArray[$randomKey];

        return    $randomValue;
    }

    function error($msg)
    {
        return ['error' => $msg];
    }
}
