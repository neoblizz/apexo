import { computed, observable } from "mobx";
import { Model, observeModel } from "pouchx";
import {
	AppointmentSchema,
	patients,
	setting,
	staff,
	Treatment,
	treatments,
} from "@modules";
import {
	comparableDate,
	generateID,
	hour,
	isToday,
	isTomorrow,
	isYesterday,
	num,
	second,
} from "@utils";

@observeModel
export class Appointment extends Model<AppointmentSchema>
	implements AppointmentSchema {
	@observable _id: string = generateID();
	@observable timer: number | null = null;

	@observable complaint: string = "";

	@observable diagnosis: string = "";

	@observable treatmentID: string = "";

	@observable multi_treatments: { id: string; type: string; units: number}[] = [];

	@observable units: number = 1;

	@observable patientID: string = "";

	@observable staffID: string[] = [];

	@observable date: number = new Date().getTime();

	@observable involvedTeeth: number[] = [];

	@observable time: number = 0;

	@observable finalPrice: number = 0;
	@observable paidAmount: number = 0;

	@observable isDone: boolean = false;

	@observable notes: string = "";

	@observable prescriptions: { prescription: string; id: string }[] = [];

	@computed get isPaid() {
		return this.paidAmount >= this.finalPrice;
	}

	@computed get outstandingAmount() {
		return this.isDone ? Math.max(this.finalPrice - this.paidAmount, 0) : 0;
	}

	@computed get overpaidAmount() {
		return Math.max(this.paidAmount - this.finalPrice, 0);
	}

	@computed
	get operatingStaff() {
		return staff!.docs.filter(
			(member) => this.staffID.indexOf(member._id) !== -1
		);
	}

	@computed
	get patient() {
		return patients!.docs.find((x) => x._id === this.patientID);
	}

	@computed
	get treatment() {
		return treatments!.docs.find((x) => x._id === this.treatmentID);
	}

	@computed
	get expenses() {
		var local_expenses = 0;
		// There's no checks in place, may cause a bug in the future.
		this.multi_treatments.forEach((x) => {
			local_expenses += (((treatments!.docs.find((y) => y._id === x.id))!.expenses) * x.units);
		});
		return local_expenses;
	}

	@computed
	get totalExpenses() {
		return this.expenses + this.spentTimeValue;
	}

	@computed
	get profit() {
		return this.finalPrice - this.totalExpenses;
	}

	@computed
	get profitPercentage() {
		return isNaN(this.profit / this.finalPrice)
			? 0
			: this.profit / this.finalPrice;
	}

	@computed
	get isOutstanding() {
		return this.isDone && this.outstandingAmount !== 0;
	}

	@computed
	get isOverpaid() {
		return this.isDone && this.overpaidAmount !== 0;
	}

	@computed
	get dueToday() {
		return isToday(this.date) && !this.isDone;
	}

	@computed
	get dueTomorrow() {
		return isTomorrow(this.date);
	}

	@computed
	get dueYesterday() {
		return isYesterday(this.date);
	}

	@computed
	get isPast() {
		const now = new Date().setHours(0, 0, 0, 0);
		const then = new Date(this.date).setHours(0, 0, 0, 0);
		return now - then > 0;
	}

	@computed
	get isMissed() {
		return this.isPast && !this.isDone && !this.dueToday;
	}

	@computed
	get isUpcoming() {
		return !this.isMissed && !this.isDone;
	}

	@computed get formattedTime() {
		return new Date(this.date)
			.toLocaleTimeString()
			.replace(/:[0-9]{2} /, " ");
	}

	@computed
	get spentTimeValue() {
		return num(setting!.getSetting("hourlyRate")) * (this.time / hour);
	}

	@computed
	get searchableString() {
		return `
				${this.complaint}
                ${this.diagnosis}
                ${new Date(this.date).toDateString()}
                ${this.treatment ? this.treatment.type : ""}
                ${this.isPaid ? "paid" : ""}
				${this.isOutstanding ? "outstanding" : ""}
				${this.isOverpaid ? "overpaid" : ""}
                ${this.isMissed ? "missed" : ""}
                ${this.dueToday ? "today" : ""}
				${this.dueTomorrow ? "tomorrow" : ""}
				${this.isUpcoming ? "upcoming future" : ""}
				${(this.patient || { name: "" }).name}
				${this.operatingStaff.map((x) => x.name).join(" ")}
				${this.notes}
		`.toLowerCase();
	}

	fromJSON(json: AppointmentSchema) {
		this._id = json._id;
		this.treatmentID = json.treatmentID;
		this.multi_treatments = json.multi_treatments;
		this.patientID = json.patientID;
		this.date = json.date;
		this.involvedTeeth = json.involvedTeeth;
		this.paidAmount = json.paidAmount;
		this.finalPrice = json.finalPrice || 0;
		this.isDone =
			typeof json.isDone === "undefined"
				? (json as any).done
				: json.isDone;
		this.prescriptions = json.prescriptions;
		this.time = json.time;
		this.diagnosis = json.diagnosis;
		this.complaint = json.complaint;
		this.staffID = json.staffID || json.doctorsID || [];
		this.units = json.units || 1;
		this.notes = json.notes
			? json.notes
			: json.complaint && json.diagnosis
			? `Complaint: ${json.complaint}.
Diagnosis: ${json.diagnosis}`
			: "";
		return this;
	}

	toJSON(): AppointmentSchema {
		return {
			_id: this._id,
			treatmentID: this.treatmentID,
			multi_treatments: Array.from(this.multi_treatments),
			patientID: this.patientID,
			date: this.date,
			involvedTeeth: Array.from(this.involvedTeeth),
			paidAmount: this.paidAmount,
			finalPrice: this.finalPrice || 0,
			isDone: this.isDone,
			prescriptions: Array.from(this.prescriptions),
			time: this.time,
			diagnosis: this.diagnosis,
			complaint: this.complaint,
			staffID: Array.from(this.staffID),
			units: this.units,
			notes: this.notes,
		};
	}

	setDate(value: number) {
		this.date = value;
	}

	timerAddOneSecond() {
		this.time = this.time + second;
	}

	addStaff(id: string) {
		this.staffID.push(id);
	}

	removeStaff(id: string) {
		this.staffID.splice(this.staffID.indexOf(id), 1);
	}
}
