const { verifySignature } = require('../utils/webhookSignature');
const inMemoryDb = require('../utils/inMemoryDb');

exports.handleExternalEvent = async (req, res) => {
    const signature = req.get('X-External-Signature') || '';
    const payload = req.body.toString('utf8');

    if (!verifySignature(signature, payload)) {
        console.warn('Webhook: Invalid signature received.');
        return res.status(401).json({ error: 'Invalid signature.' });
    }

    const { event_id, new_status, delivery_id } = JSON.parse(payload);

    try {
        if (inMemoryDb.hasDelivery(delivery_id)) {
            console.log(`Webhook: Delivery ID ${delivery_id} already processed. Ignoring.`);
            return res.status(202).json({ message: 'Accepted, already processed.' });
        }

        const event = inMemoryDb.getEventById(event_id);
        if (!event) {
            console.warn(`Webhook: Event ID ${event_id} not found.`);
            return res.status(404).json({ error: 'Event not found.' });
        }

        inMemoryDb.updateEvent(event_id, { status: new_status });
        inMemoryDb.addDelivery(delivery_id);

        console.log(`Webhook: Successfully updated event ${event_id} to ${new_status}.`);
        return res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('Webhook processing failed:', error.message);
        return res.status(500).json({ error: 'Server processing error.' });
    }
};