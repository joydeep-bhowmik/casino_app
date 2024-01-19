<div class="fixed bottom-0 z-50 w-full md:bottom-5 md:right-5 md:max-w-[300px]" style="display:none"
    x-data="{
        open: false,
        progress: 0,
        message: 'saved',
        interval: '',
        type: 'success',
        close() {
            clearInterval(this.interval);
            this.open = false;
        },
        init() {
            $watch('open', () => {
                const duration = 2000;
                this.progress = 0;
                clearInterval(this.interval);
                this.interval = setInterval(() => {
                    if (this.progress <= 100) {
                        this.progress += 1;
                    }
                    if (this.progress == 100) {
                        this.close();
                    }
                }, duration / 100);
            });
        },
        configure(data) {
            this.open = !this.open;
            this.message = data.message;
            this.type = data.type
    
        }
    }" x-on:alert.window="configure($event.detail)" x-on:alert.window="" x-show="open" x-collapse
    x-transition>
    <div class="relative mt-5 grid w-full grid-cols-[40px_auto_40px] rounded border bg-white px-3 py-5 shadow-md">
        <div>
            <svg class="h-6 w-6" x-show="type=='success'" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg class="h-6 w-6" x-show="type=='danger'" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>

        </div>
        <div x-text="message"></div>
        <button class="ml-auto" type="button" x-on:click="close()">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <div class="progress absolute bottom-0 left-0 h-1 bg-red-700" :style="'width: ' + progress + '%'"></div>
    </div>
</div>
