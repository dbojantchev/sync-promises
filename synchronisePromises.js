function synchronizePromises() {

    var promisses = [],
        expectations = 0,
        func_list,
        user_success_callback,
        user_error_callback,
        data_storage = {};

    /* check if all have completed */
    function checkExpectations() {
        if (expectations === 0) {
            console.log('Expectations met...');
            user_success_callback(data_storage);
        }
    }

    /* on success */
    function promise_done_callback(data, callername) {
        data_storage[callername] = data;
        expectations--;
        console.log("success" + JSON.stringify(data));
        checkExpectations();
    }

    /* on error */
    function promise_error_callback(err) {
        console.log("Error" + err.status);
        if (user_error_callback) user_error_callback(err);
    }

    /* Handle the arguments -- expected f(function_array, success_callback, failure callback */
    if (arguments.length < 2) return;

    if (arguments[0].length) func_list = arguments[0];
    else if (typeof arguments[0] === 'function') func_list = [arguments[0]];
    else return;

    if (typeof arguments[1] === 'function') user_success_callback = arguments[1];
    else return;

    if (arguments[2] && typeof arguments[2] === 'function') user_error_callback = arguments[2];

    /* Loop through the functions */
    for (var i = 0; i < func_list.length; i++) {
        var f = func_list[i];
        expectations++;
        var promiss = f();

        /* assign callbacks to the promisses */
        (function (fname) {
            promiss.done(function (data) {
                    promise_done_callback(data, fname);
                }
            );
        })(f.name);

        promiss.fail(promise_error_callback);
    }
}

