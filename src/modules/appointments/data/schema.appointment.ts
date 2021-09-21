import { Schema } from "pouchx";

export interface AppointmentSchema extends Schema {
	treatmentID: string;
	multi_treatments: { id: string; type: string; units: number }[];
	patientID: string;
	date: number;
	involvedTeeth: number[];
	time: number;
	paidAmount: number;
	finalPrice: number;
	isDone: boolean;
	prescriptions: { prescription: string; id: string }[];
	complaint: string;
	diagnosis: string;
	staffID?: string[];
	doctorsID?: string[];
	units: number;
	notes: string;
}
