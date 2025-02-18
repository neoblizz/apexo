import { BarChartComponent } from "@common-components";
import { text } from "@core";
import { Patient } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

@observer
export class AgeBarChart extends React.Component<{
	selectedPatients: Patient[];
}> {
	@computed
	get values() {
		return this.props.selectedPatients
			.filter((x) => x && x.birthYear)
			.map((x) => {
				if (!x || x.birthYear === 0) {
					return 0;
				}
				return Math.min(
					new Date().getFullYear() - x.birthYear,
					x.birthYear
				);
			})
			.reduce((result: { x: number; y: number }[], occ) => {
				const i = result.findIndex((rOCC) => rOCC.x === occ);
				if (i === -1) {
					result.push({
						x: occ,
						y: 1,
					});
				} else {
					result[i].y++;
				}
				return result;
			}, [])
			.sort((a, b) => a.x - b.x);
	}
	render() {
		return (
			<div>
				<BarChartComponent
					{...{
						height: 400,
						data: {
							xLabels: this.values.map((x) => x.x.toString()),
							bars: [
								{
									data: this.values.map((x) => x.y),
									label: text("age").c,
								},
							],
						},
					}}
				/>
			</div>
		);
	}
}
