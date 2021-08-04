import { text } from "@core";
import * as core from "@core";
import { Calendar, calendar } from "@modules";
import { PatientLinkComponent } from "@modules";
import * as modules from "@modules";
import { dateNames, firstDayOfTheWeekDayPicker, formatDate } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { DefaultButton, TextField } from "office-ui-fabric-react";
import * as React from "react";
import * as loadable from "react-loadable";
import {
	Col,
	ProfileSquaredComponent,
	Row,
	TagInputComponent,
} from "@common-components";
import {
	CommandBar,
	DatePicker,
	DateRangeType,
	Dropdown,
	Icon,
	IconButton,
	Panel,
	PanelType,
	Shimmer,
	Toggle,
} from "office-ui-fabric-react";

const AppointmentEditorPanel = loadable({
	loader: async () =>
		(await import("modules/appointments/components/appointment-editor"))
			.AppointmentEditorPanel,
	loading: () => <Shimmer />,
});

@observer
export class CalendarPage extends React.Component {
	readonly criticalWidth = 500;
	@observable newPatientName: string = "";
	@observable filter: string = "";
	@observable showAdditionPanel: boolean = false;
	@observable newAppointmentForPatientID: string = "";
	@computed get newAppointmentForPatient() {
		return modules.patients!.docs.find(
			(x) => x._id === this.newAppointmentForPatientID
		);
	}
	@computed get canEdit() {
		return core.user.currentUser!.canEditAppointments;
	}

	@computed get appointment() {
		return modules.appointments!.docs.find(
			(a) => a._id === core.router.selectedID
		);
	}

	@computed get selectedAppointments() {
		return this.c.selectedWeek.map((day) => {
			return modules.appointments!.appointmentsForDay(
				day.yearNum,
				day.monthNum + 1,
				day.dateNum,
				this.filter,
				this.showAll ? undefined : core.user.currentUser!._id
			);
		});
	}

	@computed get noAppointmentsThisWeek() {
		return !this.selectedAppointments.find((x) => x.length > 0);
	}

	@observable showAll: boolean = true;

	@observable c: Calendar = calendar;

	@observable collapsedMobileCalendar: boolean = false;

	componentDidMount() {
		this.unifyHeight();
	}

	componentDidUpdate() {
		this.unifyHeight();
	}

	unifyHeight() {
		if (!(core.router.innerWidth > this.criticalWidth)) {
			return;
		}
		const parent = document.getElementById("full-day-cols");
		if (!parent) {
			return;
		}
		const els = document.getElementsByClassName(
			"full-day-col"
		) as HTMLCollectionOf<HTMLDivElement>;
		let largest = 0;
		for (let index = 0; index < els.length; index++) {
			const height = els[index].clientHeight;
			if (height > largest) {
				largest = height;
			}
		}
		for (let index = 0; index < els.length; index++) {
			els[index].style.minHeight = largest ? largest + "px" : "auto";
		}
	}

	nextWeekBTN = () => {
		return (
			<IconButton
				iconProps={{ iconName: "Next" }}
				onClick={() => {
					const target = this.c.weeksCalendar[
						this.c.selectedWeekIndex + 1
					];
					if (target) {
						this.c.selected.year = target[0].yearNum;
						this.c.selected.month = target[0].monthNum;
						this.c.selected.day = target[0].dateNum;
					} else {
						this.c.selected.year = this.c.selected.year + 1;
						this.c.selected.month = this.c.weeksCalendar[0][
							this.c.weeksCalendar[0].length - 1
						].monthNum;
						this.c.selected.day = this.c.weeksCalendar[0][
							this.c.weeksCalendar[0].length - 1
						].dateNum;
					}
				}}
			></IconButton>
		);
	};

	prevWeekBTN = () => {
		return (
			<IconButton
				onClick={() => {
					const target = this.c.weeksCalendar[
						this.c.selectedWeekIndex - 1
					];
					if (target) {
						this.c.selected.year = target[0].yearNum;
						this.c.selected.month = target[0].monthNum;
						this.c.selected.day = target[0].dateNum;
					} else {
						this.c.selected.year = this.c.selected.year - 1;
						this.c.selected.month = this.c.weeksCalendar[
							this.c.weeksCalendar.length - 1
						][0].monthNum;
						this.c.selected.day = this.c.weeksCalendar[
							this.c.weeksCalendar.length - 1
						][0].dateNum;
					}
				}}
				iconProps={{ iconName: "Previous" }}
			></IconButton>
		);
	};

	render() {
		return (
			<div className="calendar-component">
				<CommandBar
					{...{
						className: "commandBar fixed",
						isSearchBoxVisible: true,
						elipisisAriaLabel: core.text("more options").c,
						farItems:
							core.router.innerWidth > 550
								? [
									{
										key: "my-appointments-only",
										onRender: () => (
											<Toggle
												checked={this.showAll}
												onText={
													text("all appointments")
														.c
												}
												offText={
													text(
														"my appointments only"
													).c
												}
												onChange={(
													ev,
													newValue
												) => {
													this.showAll = newValue!;
												}}
												className="appointments-toggle"
											/>
										),
									},
								]
								: undefined,
						items: [
							{
								key: this.canEdit ? "addNew" : "",
								title: "Add new",
								name: text("add new").c,
								onClick: () => {
									this.showAdditionPanel = true;
									this.newAppointmentForPatientID = "";
								},
								iconProps: {
									iconName: "Add",
								},
							},
							{
								key: core.router.innerWidth > 600 ? "pw" : "",
								onRender: () => (
									<this.prevWeekBTN></this.prevWeekBTN>
								),
							},

							{
								key: "ds",
								onRender: () => (
									<DatePicker
										onSelectDate={(date) => {
											if (date) {
												this.c.selected.year = date.getFullYear();
												this.c.selected.month = date.getMonth();
												this.c.selected.day = date.getDate();
											}
										}}
										formatDate={() => {
											return `${formatDate(
												new Date(
													this.c.selectedWeek[0].yearNum,
													this.c.selectedWeek[0].monthNum,
													this.c.selectedWeek[0].dateNum
												),
												modules.setting!.getSetting(
													"date_format"
												)
											)} — ${formatDate(
												new Date(
													this.c.selectedWeek[
														this.c.selectedWeek
															.length - 1
													].yearNum,
													this.c.selectedWeek[
														this.c.selectedWeek
															.length - 1
													].monthNum,
													this.c.selectedWeek[
														this.c.selectedWeek
															.length - 1
													].dateNum
												),
												modules.setting!.getSetting(
													"date_format"
												)
											)}`;
										}}
										value={
											new Date(
												this.c.selected.year,
												this.c.selected.month,
												this.c.selected.day
											)
										}
										firstDayOfWeek={firstDayOfTheWeekDayPicker(
											modules.setting!.getSetting(
												"weekend_num"
											)
										)}
										calendarProps={{
											dateRangeType: DateRangeType.Week,
											strings: {
												months: dateNames.months(),
												shortMonths: dateNames.monthsShort(),
												days: [
													"Sunday",
													"Monday",
													"Tuesday",
													"Wednesday",
													"Thursday",
													"Friday",
													"Saturday",
												],
												shortDays: [
													"Su",
													"Mo",
													"Tu",
													"We",
													"Th",
													"Fr",
													"Sa",
												],
												goToToday: "Go to today",
											},
											autoNavigateOnSelection: true,
										}}
										isMonthPickerVisible={true}
										showGoToToday={true}
									/>
								),
							},
							{
								key: core.router.innerWidth > 600 ? "nw" : "",
								onRender: () => (
									<this.nextWeekBTN></this.nextWeekBTN>
								),
							},
							{
								key: core.router.innerWidth > 550 ? "tw" : "",
								onRender: () => (
									<IconButton
										disabled={
											!!this.c.selectedWeek.find(
												(x) =>
													x.dateNum ===
													this.c.currentDay &&
													x.monthNum ===
													this.c.currentMonth &&
													x.yearNum ===
													this.c.currentYear
											)
										}
										iconProps={{
											iconName: "GotoToday",
										}}
										onClick={() => {
											this.c.selected.day = this.c.currentDay;
											this.c.selected.month = this.c.currentMonth;
											this.c.selected.year = this.c.currentYear;
										}}
										text="Today"
									/>
								),
							},
						].filter((x) => x.key),
					}}
				/>

				{core.router.innerWidth > this.criticalWidth ? (
					<div className="appointments-overview">
						<table>
							<thead>
								<tr>
									{this.c.overview
										.reduce(
											(arr: modules.DayInfo[], arr2) => {
												arr2.forEach((x) =>
													arr.push(x)
												);
												return arr;
											},
											[]
										)
										.map((day) => {
											const num = modules.appointments!.appointmentsForDay(
												day.yearNum,
												day.monthNum + 1,
												day.dateNum,
												this.filter,
												this.showAll
													? undefined
													: core.user.currentUser!._id
											).length;
											const isWeekend =
												day.weekDay.isWeekend;
											const isSelected = this.c.selectedWeek.find(
												(x) => x === day
											);
											const isCurrent =
												day.dateNum ===
												this.c.currentDay &&
												this.c.currentMonth ===
												day.monthNum &&
												day.yearNum ===
												this.c.currentYear;
											return Object.assign(day, {
												num,
												isWeekend,
												isSelected,
												isCurrent,
											});
										})
										.map((day, index, arr) => {
											const indexOfFirstIsSelected = arr.findIndex(
												(x) => x.isSelected
											);
											const isPast =
												indexOfFirstIsSelected > index;
											const isFuture =
												indexOfFirstIsSelected <
												index && !day.isSelected;
											return Object.assign(day, {
												isFuture,
												isPast,
											});
										})
										.map((day, index, arr) => {
											return (
												<td
													key={`${day.yearNum}-${day.monthNum}-${day.dateNum}`}
													onClick={() => {
														this.c.selected.year =
															day.yearNum;
														this.c.selected.month =
															day.monthNum;
														this.c.selected.day =
															day.dateNum;
													}}
													className={
														(day.isWeekend
															? " is-weekend"
															: "") +
														(day.isSelected
															? " is-selected"
															: "") +
														(day.isCurrent
															? " is-current"
															: "")
													}
												>
													<div>
														{
															text(
																day.weekDay.dayLiteralShort
																	.substr(
																		0,
																		2
																	)
																	.toLowerCase() as any
															).c
														}
													</div>
													<div>
														{day.dateNum}/
														{day.monthNum + 1}
													</div>
													<div>
														<span
															className={`appointments-num num-${day.num}`}
														>
															{day.num}
														</span>
													</div>
												</td>
											);
										})}
								</tr>
							</thead>
						</table>
					</div>
				) : (
					""
				)}

				<div
					className={`week-view${this.collapsedMobileCalendar ? " full-height" : ""
						}`}
				>
					<div
						id="full-day-cols"
						key={JSON.stringify(this.c.selected)}
					>
						{this.c.selectedWeek.map((day, index) => {
							return (
								<div
									key={`${day.yearNum}-${day.monthNum}-${day.dateNum}`}
									id={"day" + "_" + day.dateNum}
									className={
										"full-day-col" +
										(this.c.selected.day === day.dateNum
											? " selected"
											: "") +
										(day.dateNum === this.c.currentDay &&
											this.c.currentMonth === day.monthNum &&
											day.yearNum === this.c.currentYear
											? " current"
											: "")
									}
									style={{
										width:
											(
												100 / this.c.selectedWeek.length
											).toString() + "%",
									}}
								>
									<h4>
										<Row>
											<Col span={20}>
												<b>
													{formatDate(
														new Date(
															day.yearNum,
															day.monthNum,
															day.dateNum
														),
														modules.setting!.getSetting(
															"date_format"
														)
													)}
												</b>
												&nbsp;&nbsp;
												<span className="day-name">
													{
														text(
															day.weekDay.dayLiteralShort
																.substr(0, 2)
																.toLowerCase() as any
														).c
													}
												</span>
											</Col>
											<Col span={4}>
												<div className="appointments-num-wrap">
													<span
														className={`appointments-num num-${this.selectedAppointments[index].length}`}
													>
														{
															this
																.selectedAppointments[
																index
															].length
														}
													</span>
												</div>
											</Col>
										</Row>
									</h4>
									{this.selectedAppointments[index]
										.sort((a, b) => a.date - b.date)
										.map((appointment) => {
											return (
												<div
													key={appointment._id}
													className="appointment"
													onClick={() => {
														core.router.select({
															id: appointment._id,
															sub: "details",
														});
													}}
												>
													<div
														className={
															"time" +
															(appointment.isMissed
																? " missed"
																: appointment.isDone
																	? " done"
																	: "")
														}
													>
														{appointment.isMissed
															? text("missed")
															: appointment.isDone
																? text("done")
																: appointment.formattedTime}
													</div>
													<div className="m-b-5">
														<ProfileSquaredComponent
															text={
																appointment.treatment
																	? appointment
																		.treatment
																		.type
																	: ""
															}
															size={1}
														/>
													</div>
													<PatientLinkComponent
														id={
															(
																appointment.patient || {
																	_id: "",
																}
															)._id
														}
														name={
															(
																appointment.patient || {
																	name: "",
																}
															).name
														}
													/>
													{appointment.operatingStaff.map(
														(operator) => {
															return (
																<div
																	key={
																		operator._id
																	}
																	className="m-t-5 fs-11"
																>
																	<Icon iconName="Medical" />{" "}
																	{
																		operator.name
																	}
																</div>
															);
														}
													)}
												</div>
											);
										})}
								</div>
							);
						})}
					</div>
				</div>

				{this.showAdditionPanel ? (
					<Panel
						isOpen={this.showAdditionPanel}
						type={PanelType.smallFixedFar}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							this.showAdditionPanel = false;
						}}
					>
						<TagInputComponent
							label={text("create or choose patient").c}
							options={modules.patients!.docs.map((patient) => ({
								text: patient.name,
								key: patient._id,
							}))}
							className="choose-patient"
							suggestionsHeaderText={text("select patient").c}
							noResultsFoundText={text("no patient found").c}
							maxItems={1}
							disabled={!this.canEdit}
							loose
							value={
								this.newAppointmentForPatient
									? [
										{
											key: this
												.newAppointmentForPatientID,
											text: this
												.newAppointmentForPatient
												.name,
										},
									]
									: []
							}
							onChange={(selectedKeys) => {
								if (
									modules.patients!.docs.find(
										(patient) =>
											patient._id === selectedKeys[0]
									)
								) {
									this.newAppointmentForPatientID =
										selectedKeys[0];
								} else if (
									selectedKeys[0] &&
									selectedKeys[0].length
								) {
									const newPatient = modules.patients!.new();
									newPatient.name = selectedKeys[0];
									modules.patients!.add(newPatient);
									this.newAppointmentForPatientID =
										newPatient._id;
								}
							}}
						/>
						{this.newAppointmentForPatient ? (
							<Dropdown
								className="new-appointment"
								onChange={(ev, option) => {
									const newApt = modules.appointments!.new();
									newApt.patientID = this.newAppointmentForPatientID;
									newApt.date = new Date(
										this.c.selected.year,
										this.c.selected.month,
										this.c.selected.day
									).getTime();
									// newApt.treatmentID = option!.key.toString();
									// newApt.multi_treatments.map(
									// 	(t) => ({
									// 		id: option!.key.toString(),
									// 		type: (modules.treatments!.docs.find((x) => x._id === t.id))!.type,
									// 		units: 1,
									// 	})
									// );
									modules.appointments!.add(newApt);
									this.showAdditionPanel = false;
									this.newAppointmentForPatientID = "";
									core.router.select({
										id: newApt._id,
										sub: "details",
									});
								}}
								onRenderItem={(item, render) => {
									return item!.key === "ph" ? (
										<span />
									) : (
										render!(item)
									);
								}}
								panelProps={{ isLightDismiss: true }}
								options={modules
									.treatments!.docs.map((treatment) => ({
										text: treatment.type,
										key: treatment._id,
									}))
									.concat([
										{
											key: "ph",
											text:
												"＋ " +
												text("select treatment"),
										},
									])}
								selectedKey="ph"
							/>
						) : (
							""
						)}
					</Panel>
				) : (
					""
				)}

				{this.appointment && core.router.selectedSub ? (
					<AppointmentEditorPanel
						appointment={this.appointment}
						onDismiss={() => core.router.unSelect()}
					/>
				) : (
					""
				)}
			</div>
		);
	}

	findPos(obj: HTMLElement | null) {
		let currentTop = 0;
		if (obj && obj.offsetParent) {
			do {
				currentTop += obj.offsetTop;
			} while ((obj = obj.offsetParent as HTMLElement));
			return currentTop - 70;
		}
		return 0;
	}
}
