import classNames from "classnames";
import { observer } from "mobx-react";
import * as PropTypes from "prop-types";
import * as React from "react";
import { Children, cloneElement } from "react";
const enquire = require("enquire.js");

export type Breakpoint = "xxl" | "xl" | "lg" | "md" | "sm" | "xs";
export type BreakpointMap = Partial<Record<Breakpoint, string>>;

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
	gutter?: number | Partial<Record<Breakpoint, number>>;
	type?: "flex";
	align?: "top" | "middle" | "bottom";
	justify?: "start" | "end" | "center" | "space-around" | "space-between";
	prefixCls?: string;
}

export interface RowState {
	screens: BreakpointMap;
}

const responsiveArray: Breakpoint[] = ["xxl", "xl", "lg", "md", "sm", "xs"];

const responsiveMap: BreakpointMap = {
	xs: "(max-width: 575px)",
	sm: "(min-width: 576px)",
	md: "(min-width: 768px)",
	lg: "(min-width: 992px)",
	xl: "(min-width: 1200px)",
	xxl: "(min-width: 1600px)"
};
@observer
export default class Row extends React.Component<RowProps, RowState> {
	static defaultProps = {
		gutter: 0
	};

	static propTypes = {
		type: PropTypes.string,
		align: PropTypes.string,
		justify: PropTypes.string,
		className: PropTypes.string,
		children: PropTypes.node,
		gutter: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
		prefixCls: PropTypes.string
	};

	state: RowState = {
		screens: {}
	};

	componentDidMount() {
		Object.keys(responsiveMap).map((screen: Breakpoint | string) =>
			enquire.register((responsiveMap as any)[screen], {
				match: () => {
					if (typeof this.props.gutter !== "object") {
						return;
					}
					this.setState(prevState => ({
						screens: {
							...prevState.screens,
							[screen]: true
						}
					}));
				},
				unmatch: () => {
					if (typeof this.props.gutter !== "object") {
						return;
					}
					this.setState(prevState => ({
						screens: {
							...prevState.screens,
							[screen]: false
						}
					}));
				},
				// Keep a empty destory to avoid triggering unmatch when unregister
				destroy() {}
			})
		);
	}
	componentWillUnmount() {
		Object.keys(responsiveMap).map((screen: any) =>
			enquire.unregister((responsiveMap as any)[screen])
		);
	}
	getGutter() {
		const { gutter } = this.props;
		if (typeof gutter === "object") {
			for (let i = 0; i <= responsiveArray.length; i++) {
				const breakpoint: Breakpoint = responsiveArray[i];
				if (
					this.state.screens[breakpoint] &&
					gutter[breakpoint] !== undefined
				) {
					return gutter[breakpoint];
				}
			}
		}
		return gutter;
	}
	render() {
		const {
			type,
			justify,
			align,
			className,
			style,
			children,
			prefixCls = "ant-row",
			...others
		} = this.props;
		const gutter = this.getGutter();
		const classes = classNames(
			{
				[prefixCls]: !type,
				[`${prefixCls}-${type}`]: type,
				[`${prefixCls}-${type}-${justify}`]: type && justify,
				[`${prefixCls}-${type}-${align}`]: type && align
			},
			className
		);
		const rowStyle =
			(gutter as number) > 0
				? {
						marginLeft: (gutter as number) / -2,
						marginRight: (gutter as number) / -2,
						...style
				  }
				: style;
		const cols = Children.map(children, (col: any) => {
			if (!col) {
				return null;
			}
			if (col.props && (gutter as number) > 0) {
				return cloneElement(col, {
					style: {
						paddingLeft: (gutter as number) / 2,
						paddingRight: (gutter as number) / 2,
						...col.props.style
					}
				});
			}
			return col;
		});
		const otherProps = { ...others };
		delete otherProps.gutter;
		return (
			<div {...otherProps} className={classes} style={rowStyle}>
				{cols}
			</div>
		);
	}
}
