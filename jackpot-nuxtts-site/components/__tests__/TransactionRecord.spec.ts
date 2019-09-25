import { shallowMount } from '@vue/test-utils'
import {GameMoneyTransaction} from "~/types";
import {test_person1} from "~/tests/test-dummies";
import {Money} from "~/node_modules/ts-money";
import TransactionListing from "~/components/TransactionListing.vue";

let transaction: GameMoneyTransaction = {
    "amount": Money.fromDecimal(1, "USD"),
    "actor": test_person1
}


describe('TransactionListing.Vue', () => {
  test('renders props.msg when passed', () => {
    const wrapper = shallowMount(TransactionListing, {
      propsData: { transaction }
    });
    expect(wrapper.props().transaction).toBe(transaction)
  })
});
