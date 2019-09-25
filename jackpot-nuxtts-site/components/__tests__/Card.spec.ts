import { shallowMount } from '@vue/test-utils'
import Card from '@/components/Card.vue'
import {Person} from "~/types";

let person:Person = {
  "id": 1,
  "first_name": "Sebastien",
  "last_name": "Thorsby",
  "contact": {"email": "sthorsby0@psu.edu", "phone": "1-(208)492-2543"},
  "gender": "Male",
  "ip_address": "250.213.72.156",
  "avatar": "https://robohash.org/quimodisint.png?size=200x200&set=set1",
  "address": {
    "city": "Idaho Falls",
    "country": "United States",
    "postalCode": "83405",
    "state": "ID",
    "street": "9465 Utah Crossing"
  }
}

describe('Card.vue', () => {
  test('renders props.msg when passed', () => {
    const wrapper = shallowMount(Card, {
      propsData: { person }
    });
    expect(wrapper.props().person).toBe(person)
  })
});
