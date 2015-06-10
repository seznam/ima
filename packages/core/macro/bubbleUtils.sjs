let createElement = macro {
	
    rule { ($name:ident, null) } => { 
    	createElement($name, {$Utils: this.utils})
    }
	rule { ($name:ident, null, $c:expr(,)...) } => { 
    	createElement($name, {$Utils: this.utils}, $c(,)...)
    }
	rule { ($name:ident, $b) } => { 
    	createElement($name, Object.assign($b, {$Utils: this.utils}))
    }
	rule { ($name:ident, $b, $c:expr(,)...) } => { 
    	createElement($name, Object.assign($b, {$Utils: this.utils}), $c(,)...)
    }
    rule { ($name, $b) } => { 
    	createElement($name, $b)
    }
	rule { ($name, $b, $c:expr(,)...) } => { 
    	createElement($name, $b, $c(,)...)
    }
}

export createElement;