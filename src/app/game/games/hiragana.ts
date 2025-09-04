import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NgtrPhysics } from "angular-three-rapier";

@Component({
    template: `<ngtr-physics>

    </ngtr-physics>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgtrPhysics],
})
export default class Hiragana {}