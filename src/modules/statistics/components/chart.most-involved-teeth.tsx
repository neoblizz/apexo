import { PieChartComponent } from "@common-components";
import { Appointment, colors } from "@modules";
import { convert, num } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

@observer
export class MostInvolvedTeethChart extends React.Component<{
	selectedAppointments: Appointment[];
}> {
	@computed
	get data() {
		return this.props.selectedAppointments
			.map(x => x.involvedTeeth)
			.reduce((result: { label: number; value: number }[], arr) => {
				arr.forEach(n => {
					const fixedN = num(n.toString().charAt(1));
					const i = result.findIndex(x => x.label === fixedN);
					if (i === -1) {
						result.push({
							label: fixedN,
							value: 1
						});
					} else {
						result[i].value++;
					}
				});
				return result;
			}, [])
			.sort((a, b) => b.value - a.value)
			.filter((x, i) => i <= 4)
			.map((d, i) => {
				if (i === 0) {
					return {
						label: this.getToothName(d.label),
						value: d.value,
						color: colors.blue[1]
					};
				} else if (i === 1) {
					return {
						label: this.getToothName(d.label),
						value: d.value,
						color: colors.green[1]
					};
				} else if (i === 2) {
					return {
						label: this.getToothName(d.label),
						value: d.value,
						color: colors.greenish[1]
					};
				} else if (i === 3) {
					return {
						label: this.getToothName(d.label),
						value: d.value,
						color: colors.purple[1]
					};
				} else {
					return {
						label: this.getToothName(d.label),
						value: d.value,
						color: colors.orange[1]
					};
				}
			});
	}
	render() {
		return <PieChartComponent height={400} data={this.data} />;
	}
	getToothName(n: number) {
		return convert(num(`1${n.toString()}`)).Name.replace(
			/(permanent|deciduous|upper|lower|left|right)/gi,
			""
		);
	}
}
