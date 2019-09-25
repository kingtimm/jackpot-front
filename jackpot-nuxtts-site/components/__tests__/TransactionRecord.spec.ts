import { shallowMount } from '@vue/test-utils'
import {GameMoneyTransaction} from "~/types";
import {test_person1, test_person2} from "~/tests/test-dummies";
import {Money} from "~/node_modules/ts-money";
import TransactionRecord from "~/components/TransactionRecord.vue";

let gmt: GameMoneyTransaction = {
    amount: Money.fromDecimal(1, "USD"),
    fromAccount: test_person1,
    toAccount: test_person2
};

describe('TransactionRecord.Vue', () => {
  test('renders props.msg when passed', () => {
    const wrapper = shallowMount(TransactionRecord, {
      propsData: {
          transaction: gmt
      }
    });
    expect(wrapper.props().transaction).toBe(gmt)
  })
});
