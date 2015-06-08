macro to_str {
  case { _ ($toks ...) } => {
    return [makeValue(#{ $toks ... }.map(unwrapSyntax).join(''), #{ here })];
  }
}

let App = macro {
    rule infix {$ns.|.$x(.) ... = $view} => {
        $view.displayName = to_str(App.$x(.) ...);
        $ns.App.$x(.) ... = $view
    }
    rule infix {$ns.|.$x(.) ...} => {
        $ns.App.$x(.) ...
    }
}

export App;