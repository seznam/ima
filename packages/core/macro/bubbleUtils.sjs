let var = macro {
  case { $macro_name $x:ident = this; } => {
        var that = makeIdent("$__that", #{$macro_name});
        letstx $that = [that];
        return #{
            var $x = this;
            var $that = this;
        }
        
    }
    case { $macro_name } => {
        return #{
            var
        }
    }
}


let createElement = macro {

    case { $macro_name($name:ident, null) } => { 
        var that = makeIdent("$__that", #{$macro_name});
        letstx $that = [that];
        return #{
           createElement($name, {$Utils: (typeof $that !== 'undefined'?$that.utils:this.utils)})
        }
    }
    case { $macro_name($name:ident, null, $c:expr(,)...) } => { 
        var that = makeIdent("$__that", #{$macro_name});
        letstx $that = [that];
        return #{
            createElement($name, {$Utils: (typeof $that !== 'undefined'?$that.utils:this.utils)}, $c(,)...)
        }
    }
    case { $macro_name($name:ident, $b) } => { 
        var that = makeIdent("$__that", #{$macro_name});
        letstx $that = [that];
        return #{
            createElement($name, Object.assign($b, {$Utils: (typeof $that !=='undefined'?$that.utils:this.utils)}))
        }
    }
    case { $macro_name($name:ident, $b, $c:expr(,)...) } => { 
        var that = makeIdent("$__that", #{$macro_name});
        letstx $that = [that];
        return #{
            createElement($name, Object.assign($b, {$Utils: (typeof $that !== 'undefined'?$that.utils:this.utils)}), $c(,)...)
        }
    }
    case { $macro_name($name, $b) } => {
        return #{
            createElement($name, $b)
        }
    }
    case { $macro_name($name, $b, $c:expr(,)...) } => {
        return #{
            createElement($name, $b, $c(,)...)
        }
    }
}

export var;
export createElement;