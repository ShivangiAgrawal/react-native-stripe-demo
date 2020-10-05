/* eslint-disable eslint-comments/no-unused-disable */
/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {PureComponent} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import Button from './src/Components/Button';
import stripe from 'tipsi-stripe';
import axios from 'axios';

stripe.setOptions({
  publishableKey: 'STRIPE_PUBLISHABLE_KEY',
});
export default class CardFormScreen extends PureComponent {
  static title = 'Card Form';

  state = {
    loading: false,
    token: null,
    success: null,
  };

  makePayment = () => {
    console.log('makePayment::::: ');
    this.setState({loading: true});
    axios({
      method: 'POST',
      url:
        'https://us-central1-<YOUR_FIREBASE_ID>.cloudfunctions.net/completePaymentWithStripe',
      body: {
        amount: 100,
        currency: 'usd',
        token: this.state.token,
      },
    })
      .then((response) => {
        console.log('Success::::: ', response);
        this.setState({loading: false});
      })
      .catch((error) => {
        console.log('Failed:::::', error);
        this.setState({loading: false});
      });
  };

  handleCardPayPress = async () => {
    try {
      this.setState({loading: true, token: null});
      const token = await stripe.paymentRequestWithCardForm({
        // Only iOS support these options
        smsAutofillDisabled: true,
        requiredBillingAddressFields: 'full',
        prefilledInformation: {
          billingAddress: {
            name: 'Ebill Store',
            line1: 'NY Street',
            line2: '3',
            city: 'Rochester',
            state: 'New York',
            country: 'United States',
            postalCode: '14602',
            email: 'xyz@gmail.com',
          },
        },
      });
      console.log(token);

      this.setState({loading: false, token});
    } catch (error) {
      this.setState({loading: false});
    }
  };

  render() {
    const {loading, token, success, response} = this.state;

    return (
      <View style={styles.container}>
        <Image
          style={{width: 50, height: 50}}
          source={{
            uri: 'https://enappd.com/static/images/enappd-logo-blue.png',
          }}
        />
        <View style={styles.containerTitle}>
          <Text style={styles.title}>Stripe Payment in React Native</Text>
          <Text style={styles.subtitle}>by Enappd</Text>
        </View>
        <Text style={styles.header}>Card Form Example</Text>
        <Text style={styles.instruction}>
          Click button to show Card Form dialog.
        </Text>
        <Button
          text="Enter you card and pay"
          loading={loading}
          onPress={this.handleCardPayPress}
        />
        <View style={styles.token}>
          {token && (
            <>
              <Text style={styles.instruction}>Token: {token.tokenId}</Text>
              <Button
                text="Make Payment"
                loading={loading}
                onPress={this.makePayment}
              />
            </>
          )}
          {success && (
            <>
              <Text style={styles.instruction}>Status: {response.status}</Text>
              <Text style={styles.instruction}>ID: {response.id}</Text>
              <Text style={styles.instruction}>Amount: {response.amount}</Text>
            </>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerTitle: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  token: {
    height: 20,
  },
});
