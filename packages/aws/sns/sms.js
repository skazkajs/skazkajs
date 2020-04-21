class SMS {
  constructor() {
    this.message = '';
    this.phone = '';
    this.sender = '';
  }

  setMessage(message) {
    this.message = message;

    return this;
  }

  setPhone(phone) {
    this.phone = phone;

    return this;
  }

  setSender(sender) {
    this.sender = sender;

    return this;
  }

  getParams() {
    return {
      Message: this.message,
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional',
        },
        'AWS.SNS.SMS.SenderID': {
          DataType: 'String',
          StringValue: this.sender,
        },
      },
      PhoneNumber: this.phone,
    };
  }
}

module.exports = SMS;
