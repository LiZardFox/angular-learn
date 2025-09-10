// @ts-expect-error
import target from '../../../../../public/axe-throwing/models/Ancient Ruins target.glb' with { loader: 'file' };
// @ts-expect-error
import ruins from '../../../../../public/axe-throwing/models/AncientRuins-v1.glb' with { loader: 'file' };
// @ts-expect-error
import axeSmallApp from '../../../../../public/axe-throwing/models/Axe Small Applied.glb' with { loader: 'file' };
// @ts-expect-error
import axeSmall from '../../../../../public/axe-throwing/models/Axe Small.glb' with { loader: 'file' };
// @ts-expect-error
import balloon from '../../../../../public/axe-throwing/models/balloon_modified.glb' with { loader: 'file' };
import { gltfResource } from 'angular-three-soba/loaders';

gltfResource.preload(target);
gltfResource.preload(ruins);
gltfResource.preload(axeSmallApp);
gltfResource.preload(axeSmall);
gltfResource.preload(balloon);

export { target, ruins, axeSmallApp, axeSmall, balloon };
