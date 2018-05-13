function requireArgParams(wrapped, params){
    if(Array.isArray(params)) {
        return function() {
            let hasRequired = true;
            for(let i = 0; i < params.length; i++){
                if(arguments[1][params[i]] === undefined) {
                    hasRequired = false;
                }
            }
            if(hasRequired) {
                return wrapped.apply(this, arguments);
            } else {
                return undefined;
            }
        }
    } else {
        return function(){
            return wrapped.apply(this, arguments);
        }
    }
}

module.exports = {
    requireArgParams: requireArgParams
}