setInterval(function() {
    $.ajax({
        url: '/api/cached',
        type: 'GET',
        dataType: 'json',
        success: function(result) {
            $('#state').text(result.cached ? "Cached" : "Not cached")
        }
    })
}, 100); // every 100 ms

var greet = function() {
    $('.result').hide();
    $('.requestInProgress').show();
    var requestTime = getTime();
    $.ajax({
        url: '/api/greeting',
        type: 'GET',
        dataType: 'json', // data type of response
        success: function(result) {
            $('.result').show();
            $('.requestInProgress').hide();
            $('#greeting').text(result.message);
            $('#responseTime').text(getTime() - requestTime);
        }
    })
};

var clearCache = function() {
    $.ajax({
        url: '/api/cached',
        type: 'DELETE'
    })
};

var getTime = function() {
    return new Date().getTime();
};
