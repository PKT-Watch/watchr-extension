class AddressTransaction {
    constructor(json, address) {
      this.txid = json['txid'];
      this.value = '0';
      this.blockTime = json['blockTime'];
      this.firstSeen = json['firstSeen'];
      this.input = [];
      this.output = [];
  
      let inputs = json['input'];
      for (let element of inputs) {
        let inp = AddressTransactionInput.fromJson(element);
        this.input.push(inp);
      }
  
      let outputs = json['output'];
      for (let element of outputs) {
        let out = AddressTransactionOutput.fromJson(element);
        this.output.push(out);
      }
  
      this.input.sort((a, b) => a.value.localeCompare(b.value));
      this.output.sort((a, b) => a.value.localeCompare(b.value));
  
      let direction = '';
      this.isSend = false;
      this.isReceive = false;
      this.isFolding = false;
      this.counterparty = '';
  
      for (let inp of this.input) {
        if (inp.address === address) {
          this.value = inp.value;
          direction = '-';
          this.isSend = true;
        }
        this.counterparty = inp.address;
      }
  
      if (direction === '') {
        for (let out of this.output) {
          if (out.address === address) {
            this.value = out.value;
            direction = '+';
            this.isReceive = true;
          }
        }
      } else {
        this.counterparty = '';
        for (let out of this.output) {
          if (out.address === address) {
            // This is when we receive change back, we need to deduct from the
            // amount that we're spending to get the right sum.
            this.value = (parseInt(this.value) - parseInt(out.value)).toString();
            if (this.output.length === 1) {
              this.counterparty = 'Folding';
              this.isFolding = true;
              this.isSend = false;
            }
            continue;
          }
          this.counterparty = out.address;
        }
      }
    }
  }
  
  class AddressTransactionInput {
    static fromJson(json) {
      let input = new AddressTransactionInput();
      input.address = json['address'];
      input.value = json['value'];
      return input;
    }
  }
  
  class AddressTransactionOutput {
    static fromJson(json) {
      let output = new AddressTransactionOutput();
      output.address = json['address'];
      output.value = json['value'];
      return output;
    }
  }
  
  export { AddressTransaction };