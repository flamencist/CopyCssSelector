var watchSelector = function(obj,$$,inspect){
    var oldValue = obj.selector;
    var digest = function(){
        setTimeout(function(){
            var newValue = obj.selector;
            if(oldValue !== newValue){
                inspect($$(newValue)[0]);
                oldValue = newValue;
            }
            digest();
        },500);
    };
    digest();
};
