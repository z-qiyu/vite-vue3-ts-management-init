import type {RouteRecordRaw} from 'vue-router'

type Meta = {
  title: string;
};

export type RouteRaw = {
  meta: Meta;
  children?: RouteRaw[]
} & RouteRecordRaw