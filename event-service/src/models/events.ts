import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: false },
  date: { type: Date, required: false },
  created: { type: Date, default: Date.now },
  description: { type: String, required: false },
  open: { type: Boolean, required: true },
  host: { type: String, required: false },
  location: { type: String, required: false },
  cost: { type: String, required: false },
  capacity: { type: Number, required: false },
  guests: { type: [String], required: false },
  showGuests: { type: Number, required: false },
});

export const EventModel = mongoose.model('Event', EventSchema);

export const getEventsByHost = async (host: string) => await EventModel.find({ host });
export const getEventById = async (id: string) => await EventModel.findById({ id });
export const createEvent = async (values: Record<string, any>) => await new EventModel(values).save(); 
export const deleteEventById = async (id: string) => await EventModel.findByIdAndDelete({ _id: id });
export const updateEventById = async (id: string, values: Record<string, any>) => await EventModel.findByIdAndUpdate(id, values, { new: true });