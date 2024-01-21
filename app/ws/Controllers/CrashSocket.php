<?php

namespace App\Ws\Controllers;

use React\EventLoop\Loop;
use Ratchet\ConnectionInterface;
use React\EventLoop\Timer\Timer;
use App\Ws\Controllers\WsController;

class CrashSocket extends WsController
{
    private $loop;
    private $timer;
    private $crash_at;
    private $i = 0;
    public $betting = false;

    public function withConstruct()
    {
        $this->loop = Loop::get();
    }

    public function withOnOpen(ConnectionInterface $conn)
    {

        // Set the initial crash point
        $this->crash_at = $this->select_random_crash_point();

        // Start the timer
        $this->timer = $this->loop->addPeriodicTimer(0.5, function () use ($conn,) {
            $this->betting = false;
            $this->i = $this->i + 0.1;
            if ($this->crash_at <= $this->i + 0.3) {
                $this->betting = true;
            }

            if ($this->crash_at <= $this->i) {

                // Reset the counter and update the crash point
                sleep(5);
                $this->betting = false;
                $this->i = 0;
                $this->crash_at = $this->select_random_crash_point();
            }

            $conn->send($this->i . ',' . $this->betting);
        });
    }
    function onMessage(ConnectionInterface $from, $msg)
    {
        foreach ($this->clients as $client) {
            $client->send('betting status' . $this->betting);
        }
    }
    private function select_random_crash_point()
    {
        return 3.8;
    }

    public function run()
    {
        $this->loop->run();
    }
}
