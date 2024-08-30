import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MeasureSchema = new Schema({
    customer_code: { type: String, required: true },
    measure_type: { type: String, required: true },
    measure_datetime: { type: String, required: true },
    measure_value: { type: Number, required: true },
    image_url: { type: String, required: true },
    measure_uuid: { type: String, required: true },
    has_confirmed: { type: Boolean, required: true, default: false }
});

const Measure = mongoose.model('Measure', MeasureSchema);
export default Measure;