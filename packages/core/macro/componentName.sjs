let namespace = macro {
  case infix { ns.|$macro_name($name) } => {
		var ns = makeIdent("ns", #{$macro_name});
		letstx $ns = [ns];
		var componentName = makeIdent("componentName", #{$macro_name});
          letstx $componentName = [componentName];
		return #{
		  $ns.namespace($name);
		  var $componentName = $name
		}
	}
}

let displayName = macro {
  case { $macro_name $(:)$name } => {
        var componentName = makeIdent("componentName", #{$macro_name});
        letstx $componentName = [componentName];
        return #{
            displayName:$componentName
        }
    }
}


export displayName;
export namespace;