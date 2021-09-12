const consumerKey = process.env.WOOCOMMERCE_CONSUMERKEY;
const consumerSecret = process.env.WOOCOMMERCE_CONSUMERSECRET;
const version = process.env.WOOCOMMERCE_VERSION;
const baseUrl = process.env.WOOCOMMERCE_URL;

const axios = require('axios');

module.exports = {
    getMembershipByEmail: (req, res) => {
        const {email} = req.params;
        const customersParams = {
            role: 'all',
            email: email,
            consumer_key: consumerKey,
            consumer_secret: consumerSecret
        }
        const customersUrl = baseUrl + version + 'customers';
        axios.get(customersUrl, { params: customersParams })
            .then((response) => {
                if ( response.data.length > 0 ) {
                    const {id} = response.data[0];
                    const subscriptionsParams = {
                        customer: id,
                        consumer_key: consumerKey,
                        consumer_secret: consumerSecret
                    }
                    const subscriptionsUrl = baseUrl + version + 'subscriptions';
                    axios.get(subscriptionsUrl, { params: subscriptionsParams })
                        .then((response) => {
                            console.log(response.data);
                            res.json(response.data);
                        }), (error) => {
                            res.json(error);
                        };
                } else {
                    res.json({});
                }
            }), (error) => {
                res.json(error);
            };
    },
    getMembershipByID: async (id) => {
        const subscriptionsParams = {
            customer: id,
            consumer_key: consumerKey,
            consumer_secret: consumerSecret
        }
        const subscriptionsUrl = baseUrl + version + 'subscriptions';
        let subscriptions = {};
        await axios.get(subscriptionsUrl, { params: subscriptionsParams })
            .then((response) => {
                subscriptions = response.data;
            }), (error) => {
                return error;
            };

        return subscriptions;
    }
}
