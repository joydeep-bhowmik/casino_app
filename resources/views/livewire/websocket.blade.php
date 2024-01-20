<div>
    <script>
        var conn = new WebSocket('ws://{{ env('PUSHER_HOST') }}:6001/chat');
        conn.onopen = function(e) {
            console.log("Connection established!");
        };

        conn.onmessage = function(e) {
            console.time('total');
            console.log(e.data);
        };

        function send_message($value) {
            console.timeEnd('total');
            conn.send($value)
        }
    </script>
    <input id="msg" type="text">
    <button onclick="send_message(msg.value)">send</button>
</div>
