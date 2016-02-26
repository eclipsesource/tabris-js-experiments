import {Composite} from './../tabris/components';

export function Spacer(config = {}) {
	return (
		Composite({
			layoutData: {height: config.height || 1, right: 0, left: 0, top: "prev()"},
			background: config.color || "rgba(0, 0, 0, 0.1)"
		})
	)
}

export function Each(ArrayToIterate , ComponentForEachItem, FallbackComponent) {
	return (
		(ArrayToIterate && ArrayToIterate.length > 0) ? ArrayToIterate.map( ComponentForEachItem ) : (FallbackComponent ? [FallbackComponent] : [])
	)
}

