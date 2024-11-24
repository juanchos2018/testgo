<riot-active-switch>
    <label class="switch m-b-none">
        <input type="checkbox" checked="{ opts.value == 't' }" name="checkbox" onchange="{ activate }">
        <span></span>
    </label>

    <style scoped>
        input[type="checkbox"]:disabled + span {
            opacity: .5;
        }
    </style>

    <script>
        var self = this
        var url = window.siteUrl('app/riot_active_switch')

        activate(e) {

            e.target.disabled = 'disabled'

            self.request && self.request.abort()

            self.request = new XMLHttpRequest()
            self.request.open('get', url + '/' + self.opts.target + '/' + self.opts.reference + '/' + (e.target.checked ? 't' : 'f'))
            self.request.responseType = 'json'
            self.request.onload = function () {
                var data = self.request.response

                if (!data || !data.ok) {
                    e.target.checked = !e.target.checked
                }

                e.target.removeAttribute('disabled')
            }
            self.request.onerror = function () {
                e.target.checked = !e.target.checked
                e.target.removeAttribute('disabled')
            }
            self.request.send()
        }
    </script>
</riot-active-switch>
