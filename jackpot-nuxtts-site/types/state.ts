import {GameObject, Person} from "~/types";

export interface RootState {
  people: Person[];
  game: GameObject;
}
