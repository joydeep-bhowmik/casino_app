<?php

namespace App\Http\Controllers\Games;

use App\Models\Game;
use App\Models\Item;
use App\Models\User;
use App\Models\Round;
use App\Models\Product;


class DealsGameController extends BaseGameController
{
    private $uid = 'deals';
    private $bet;

    public function __construct(public $product_id, public int $chance, public $user_id)
    {
    }

    function start(): array
    {

        $game = Game::where('uid', $this->uid)->first();

        $user = User::find($this->user_id);

        $product = Product::find($this->product_id);

        $error = $this->_validate([
            'game' => $game,
            'user' => $user,
            'product' => $product
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

            $user->withdraw($this->bet);

            $data = (object) $game_data;

            if ($data->result === true) {

                $round->payout = $product->price;

                $item = new Item();

                $item->product_id = $product->id;

                $item->user_id = $user->id;

                $item->save();
            }

            $round->status = 'finished';

            $round->save();

            $message = $data->result ? 'won ' . $round->payout . ' points' : 'lost the round';

            return $this->success($message, data: [
                'balance' => $user->balanceInt,
                'result' =>   $data->result,
                'round_id' => $round->id,
                'payout' => $round->payout
            ]);
        };
    }

    function _validate(array $arr): array
    {
        $object = (object) $arr;

        if (!$object->user) {
            return $this->error('Login to play');
        }

        if (!$object->game) {
            return $this->error('Invalid game');
        }

        if (!$object->product || !$object->product->price) {

            return $this->error('Invalid item' . $object->product->price);
        }
        $this->bet = ($object->product->price * $this->chance) / 100;

        if (!$this->bet) return $this->error('Invalid bet');

        if ($this->bet > $object->user->balanceInt) {
            return  $this->error('Insufficient funds');
        }
        return [];
    }

    function configure()
    {

        return [
            'bet' => $this->bet,
            'chance' => $this->chance,
            'product_id' => $this->product_id,
            'result' => $this->generateResult($this->chance)
        ];
    }



    function generateResult($probabilityPercentage): bool
    {
        $randomNumber = rand(1, 100);

        if ($randomNumber <= $probabilityPercentage) {
            return true;
        }
        return false;
    }
}
