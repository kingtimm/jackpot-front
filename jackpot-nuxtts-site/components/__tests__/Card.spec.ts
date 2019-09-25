import { shallowMount } from '@vue/test-utils'
import Card from '@/components/Card.vue'
import {Person} from "~/types";
import {test_person1 } from "~/tests/test-dummies";

let person1:Person = test_person1

describe('Card.vue', () => {
  test('renders props.msg when passed', () => {
    const wrapper = shallowMount(Card, {
      propsData: { person: person1 }
    });
    expect(wrapper.props().person).toBe(person1)
  })
});
