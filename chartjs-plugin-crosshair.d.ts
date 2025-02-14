// Type definitions for chartjs-plugin-crosshair 1.1
// Project: https://chartjs-plugin-crosshair.netlify.com, https://github.com/viaMover/web-app
// Definitions by: Dan Manastireanu <https://github.com/danmana>, Andrew Gergert <https://github.com/sinu5oid>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped, https://github.com/viaMover/web-app
// TypeScript Version: 3.2

import { InteractionModeFunction, Plugin } from 'chart.js';

declare module 'chart.js' {
  interface ChartPluginsOptions {
    crosshair?: CrosshairOptions | undefined;
  }

  interface InteractionModeMap {
    interpolate: InteractionModeFunction;
  }

  interface ChartDataSets {
    interpolate?: boolean | undefined;
  }
}

// This is a workaround needed because:
// classes exported with `export = ` can't be augmented by normal module augmentation (like we use above)
// see https://github.com/Microsoft/TypeScript/issues/14080
declare global {
  interface Chart {
    panZoom: (increment: number) => void;
  }
}

export interface CrosshairOptions {
  line?: LineOptions | undefined;
  sync?: SyncOptions | undefined;
  zoom?: ZoomOptions | undefined;
  snap?: SnapOptions | undefined;
  callbacks?: CallbackOptions | undefined;
}

/** https://chartjs-plugin-crosshair.netlify.app/options.html#crosshair-line-options */
export interface LineOptions {
  color?: string | undefined;
  width?: number | undefined;
  dashPattern?: number[] | undefined;
}

/** https://chartjs-plugin-crosshair.netlify.app/options.html#chart-interaction-syncing */
export interface SyncOptions {
  enabled?: boolean | undefined;
  group?: number | undefined;
  suppressTooltips?: boolean | undefined;
}

/** https://chartjs-plugin-crosshair.netlify.app/options.html#zooming */
export interface ZoomOptions {
  enabled?: boolean | undefined;
  zoomboxBackgroundColor?: string | undefined;
  zoomboxBorderColor?: string | undefined;
  zoomButtonText?: string | undefined;
  zoomButtonClass?: string | undefined;
}

/** https://chartjs-plugin-crosshair.netlify.app/options.html#snapping */
export interface SnapOptions {
  enabled?: boolean | undefined;
}

/** https://chartjs-plugin-crosshair.netlify.app/options.html#callbacks */
export interface CallbackOptions {
  beforeZoom?: ((start: number, end: number) => boolean) | undefined;
  afterZoom?: ((start: number, end: number) => void) | undefined;
}

/** since version 1.2.0 **/
declare module 'chartjs-plugin-crosshair' {
  export const Interpolate = InteractionModeFunction;

  export const CrosshairPlugin: Plugin;
}
