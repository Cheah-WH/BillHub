const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AutoBillingSchema = new Schema({
    billId: {
        type: Schema.Types.ObjectId,
        ref: 'Bill',
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    autoPaymentDate: {
        type: String,
        enum: ['billingdate', 'duedate'],
        required: true,
    },
    paymentAmount: {
        type: String,
        enum: ['fixedAmount', 'outstandingAmount'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
});

const AutoBilling = mongoose.model('AutoBilling', AutoBillingSchema);

module.exports = AutoBilling;