// react.sjs

let React = macro {
    case { $macro_name } => {
        var ns = makeIdent("ns", #{$macro_name});
        letstx $ns = [ns];
        return #{
            $ns.Vendor.React
        }
        
    }
}

export React;