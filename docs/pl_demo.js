let wasm_bindgen;
(function() {
    const __exports = {};
    let script_src;
    if (typeof document !== 'undefined' && document.currentScript !== null) {
        script_src = new URL(document.currentScript.src, location.href).toString();
    }
    let wasm = undefined;

    function isLikeNone(x) {
        return x === undefined || x === null;
    }

    function addToExternrefTable0(obj) {
        const idx = wasm.__externref_table_alloc();
        wasm.__wbindgen_export_1.set(idx, obj);
        return idx;
    }

    const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

    if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

    let cachedUint8ArrayMemory0 = null;

    function getUint8ArrayMemory0() {
        if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
            cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
        }
        return cachedUint8ArrayMemory0;
    }

    function getStringFromWasm0(ptr, len) {
        ptr = ptr >>> 0;
        return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
    }

    function handleError(f, args) {
        try {
            return f.apply(this, args);
        } catch (e) {
            const idx = addToExternrefTable0(e);
            wasm.__wbindgen_exn_store(idx);
        }
    }

    let WASM_VECTOR_LEN = 0;

    const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

    const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
        ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
    }
        : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    });

    function passStringToWasm0(arg, malloc, realloc) {

        if (realloc === undefined) {
            const buf = cachedTextEncoder.encode(arg);
            const ptr = malloc(buf.length, 1) >>> 0;
            getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
            WASM_VECTOR_LEN = buf.length;
            return ptr;
        }

        let len = arg.length;
        let ptr = malloc(len, 1) >>> 0;

        const mem = getUint8ArrayMemory0();

        let offset = 0;

        for (; offset < len; offset++) {
            const code = arg.charCodeAt(offset);
            if (code > 0x7F) break;
            mem[ptr + offset] = code;
        }

        if (offset !== len) {
            if (offset !== 0) {
                arg = arg.slice(offset);
            }
            ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
            const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
            const ret = encodeString(arg, view);

            offset += ret.written;
            ptr = realloc(ptr, len, offset, 1) >>> 0;
        }

        WASM_VECTOR_LEN = offset;
        return ptr;
    }

    let cachedDataViewMemory0 = null;

    function getDataViewMemory0() {
        if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
            cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
        }
        return cachedDataViewMemory0;
    }

    const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(state => {
        wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b)
    });

    function makeMutClosure(arg0, arg1, dtor, f) {
        const state = { a: arg0, b: arg1, cnt: 1, dtor };
        const real = (...args) => {
            // First up with a closure we increment the internal reference
            // count. This ensures that the Rust closure environment won't
            // be deallocated while we're invoking it.
            state.cnt++;
            const a = state.a;
            state.a = 0;
            try {
                return f(a, state.b, ...args);
            } finally {
                if (--state.cnt === 0) {
                    wasm.__wbindgen_export_6.get(state.dtor)(a, state.b);
                    CLOSURE_DTORS.unregister(state);
                } else {
                    state.a = a;
                }
            }
        };
        real.original = state;
        CLOSURE_DTORS.register(real, state, state);
        return real;
    }

    function debugString(val) {
        // primitive types
        const type = typeof val;
        if (type == 'number' || type == 'boolean' || val == null) {
            return  `${val}`;
        }
        if (type == 'string') {
            return `"${val}"`;
        }
        if (type == 'symbol') {
            const description = val.description;
            if (description == null) {
                return 'Symbol';
            } else {
                return `Symbol(${description})`;
            }
        }
        if (type == 'function') {
            const name = val.name;
            if (typeof name == 'string' && name.length > 0) {
                return `Function(${name})`;
            } else {
                return 'Function';
            }
        }
        // objects
        if (Array.isArray(val)) {
            const length = val.length;
            let debug = '[';
            if (length > 0) {
                debug += debugString(val[0]);
            }
            for(let i = 1; i < length; i++) {
                debug += ', ' + debugString(val[i]);
            }
            debug += ']';
            return debug;
        }
        // Test for built-in
        const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
        let className;
        if (builtInMatches && builtInMatches.length > 1) {
            className = builtInMatches[1];
        } else {
            // Failed to match the standard '[object ClassName]'
            return toString.call(val);
        }
        if (className == 'Object') {
            // we're a user defined class or Object
            // JSON.stringify avoids problems with cycles, and is generally much
            // easier than looping through ownProperties of `val`.
            try {
                return 'Object(' + JSON.stringify(val) + ')';
            } catch (_) {
                return 'Object';
            }
        }
        // errors
        if (val instanceof Error) {
            return `${val.name}: ${val.message}\n${val.stack}`;
        }
        // TODO we could test for more things here, like `Set`s and `Map`s.
        return className;
    }
    function __wbg_adapter_30(arg0, arg1) {
        wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h463d8c7d979dbcfb(arg0, arg1);
    }

    function __wbg_adapter_33(arg0, arg1, arg2) {
        wasm.closure4905_externref_shim(arg0, arg1, arg2);
    }

    function __wbg_adapter_44(arg0, arg1, arg2, arg3) {
        wasm.closure4911_externref_shim(arg0, arg1, arg2, arg3);
    }

    const __wbindgen_enum_ResizeObserverBoxOptions = ["border-box", "content-box", "device-pixel-content-box"];

    const __wbindgen_enum_VisibilityState = ["hidden", "visible"];

    async function __wbg_load(module, imports) {
        if (typeof Response === 'function' && module instanceof Response) {
            if (typeof WebAssembly.instantiateStreaming === 'function') {
                try {
                    return await WebAssembly.instantiateStreaming(module, imports);

                } catch (e) {
                    if (module.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                    } else {
                        throw e;
                    }
                }
            }

            const bytes = await module.arrayBuffer();
            return await WebAssembly.instantiate(bytes, imports);

        } else {
            const instance = await WebAssembly.instantiate(module, imports);

            if (instance instanceof WebAssembly.Instance) {
                return { instance, module };

            } else {
                return instance;
            }
        }
    }

    function __wbg_get_imports() {
        const imports = {};
        imports.wbg = {};
        imports.wbg.__wbg_Window_14cc3c5ee5dce589 = function(arg0) {
            const ret = arg0.Window;
            return ret;
        };
        imports.wbg.__wbg_Window_f1aabb4924e1d67a = function(arg0) {
            const ret = arg0.Window;
            return ret;
        };
        imports.wbg.__wbg_WorkerGlobalScope_cdbac16359537c9f = function(arg0) {
            const ret = arg0.WorkerGlobalScope;
            return ret;
        };
        imports.wbg.__wbg_abort_775ef1d17fc65868 = function(arg0) {
            arg0.abort();
        };
        imports.wbg.__wbg_activeElement_367599fdfa7ad115 = function(arg0) {
            const ret = arg0.activeElement;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_addEventListener_90e553fdce254421 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
            arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3);
        }, arguments) };
        imports.wbg.__wbg_addListener_2982bb811b6385c5 = function() { return handleError(function (arg0, arg1) {
            arg0.addListener(arg1);
        }, arguments) };
        imports.wbg.__wbg_altKey_c33c03aed82e4275 = function(arg0) {
            const ret = arg0.altKey;
            return ret;
        };
        imports.wbg.__wbg_altKey_d7495666df921121 = function(arg0) {
            const ret = arg0.altKey;
            return ret;
        };
        imports.wbg.__wbg_animate_e8655261bbcba4d2 = function(arg0, arg1, arg2) {
            const ret = arg0.animate(arg1, arg2);
            return ret;
        };
        imports.wbg.__wbg_appendChild_8204974b7328bf98 = function() { return handleError(function (arg0, arg1) {
            const ret = arg0.appendChild(arg1);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_arrayBuffer_d1b44c4390db422f = function() { return handleError(function (arg0) {
            const ret = arg0.arrayBuffer();
            return ret;
        }, arguments) };
        imports.wbg.__wbg_blockSize_1490803190b57a34 = function(arg0) {
            const ret = arg0.blockSize;
            return ret;
        };
        imports.wbg.__wbg_body_942ea927546a04ba = function(arg0) {
            const ret = arg0.body;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_brand_ea03eb348cfdee8f = function(arg0, arg1) {
            const ret = arg1.brand;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_brands_e9fa822fae2acb51 = function(arg0) {
            const ret = arg0.brands;
            return ret;
        };
        imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
            const ret = arg0.buffer;
            return ret;
        };
        imports.wbg.__wbg_button_f75c56aec440ea04 = function(arg0) {
            const ret = arg0.button;
            return ret;
        };
        imports.wbg.__wbg_buttons_b6346af6f04e4686 = function(arg0) {
            const ret = arg0.buttons;
            return ret;
        };
        imports.wbg.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
            const ret = arg0.call(arg1);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_call_7cccdd69e0791ae2 = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.call(arg1, arg2);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_cancelAnimationFrame_089b48301c362fde = function() { return handleError(function (arg0, arg1) {
            arg0.cancelAnimationFrame(arg1);
        }, arguments) };
        imports.wbg.__wbg_cancelIdleCallback_669eb1ed294c8b8b = function(arg0, arg1) {
            arg0.cancelIdleCallback(arg1 >>> 0);
        };
        imports.wbg.__wbg_cancel_e144af3144baffb2 = function(arg0) {
            arg0.cancel();
        };
        imports.wbg.__wbg_catch_a6e601879b2610e9 = function(arg0, arg1) {
            const ret = arg0.catch(arg1);
            return ret;
        };
        imports.wbg.__wbg_clearTimeout_b2651b7485c58446 = function(arg0, arg1) {
            arg0.clearTimeout(arg1);
        };
        imports.wbg.__wbg_close_414b379454494b29 = function(arg0) {
            arg0.close();
        };
        imports.wbg.__wbg_code_459c120478e1ab6e = function(arg0, arg1) {
            const ret = arg1.code;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_contains_3361c7eda6c95afd = function(arg0, arg1) {
            const ret = arg0.contains(arg1);
            return ret;
        };
        imports.wbg.__wbg_contentRect_81407eb60e52248f = function(arg0) {
            const ret = arg0.contentRect;
            return ret;
        };
        imports.wbg.__wbg_createElement_8c9931a732ee2fea = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.createElement(getStringFromWasm0(arg1, arg2));
            return ret;
        }, arguments) };
        imports.wbg.__wbg_createObjectURL_6e98d2f9c7bd9764 = function() { return handleError(function (arg0, arg1) {
            const ret = URL.createObjectURL(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments) };
        imports.wbg.__wbg_crypto_ed58b8e10a292839 = function(arg0) {
            const ret = arg0.crypto;
            return ret;
        };
        imports.wbg.__wbg_ctrlKey_1e826e468105ac11 = function(arg0) {
            const ret = arg0.ctrlKey;
            return ret;
        };
        imports.wbg.__wbg_ctrlKey_cdbe8154dfb00d1f = function(arg0) {
            const ret = arg0.ctrlKey;
            return ret;
        };
        imports.wbg.__wbg_deltaMode_9bfd9fe3f6b4b240 = function(arg0) {
            const ret = arg0.deltaMode;
            return ret;
        };
        imports.wbg.__wbg_deltaX_5c1121715746e4b7 = function(arg0) {
            const ret = arg0.deltaX;
            return ret;
        };
        imports.wbg.__wbg_deltaY_f9318542caea0c36 = function(arg0) {
            const ret = arg0.deltaY;
            return ret;
        };
        imports.wbg.__wbg_devicePixelContentBoxSize_a6de82cb30d70825 = function(arg0) {
            const ret = arg0.devicePixelContentBoxSize;
            return ret;
        };
        imports.wbg.__wbg_devicePixelRatio_68c391265f05d093 = function(arg0) {
            const ret = arg0.devicePixelRatio;
            return ret;
        };
        imports.wbg.__wbg_disconnect_2118016d75479985 = function(arg0) {
            arg0.disconnect();
        };
        imports.wbg.__wbg_disconnect_ac3f4ba550970c76 = function(arg0) {
            arg0.disconnect();
        };
        imports.wbg.__wbg_document_d249400bd7bd996d = function(arg0) {
            const ret = arg0.document;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_error_1004b8c64097413f = function(arg0, arg1) {
            console.error(arg0, arg1);
        };
        imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            }
        };
        imports.wbg.__wbg_exitFullscreen_909f35c20d9db949 = function(arg0) {
            arg0.exitFullscreen();
        };
        imports.wbg.__wbg_exitPointerLock_7b6e7252c7133f69 = function(arg0) {
            arg0.exitPointerLock();
        };
        imports.wbg.__wbg_fetch_1b7e793ab8320753 = function(arg0, arg1, arg2) {
            const ret = arg0.fetch(getStringFromWasm0(arg1, arg2));
            return ret;
        };
        imports.wbg.__wbg_fetch_6fed924f7801d8f3 = function(arg0, arg1, arg2) {
            const ret = arg0.fetch(getStringFromWasm0(arg1, arg2));
            return ret;
        };
        imports.wbg.__wbg_focus_7d08b55eba7b368d = function() { return handleError(function (arg0) {
            arg0.focus();
        }, arguments) };
        imports.wbg.__wbg_fullscreenElement_a2f691b04c3b3de5 = function(arg0) {
            const ret = arg0.fullscreenElement;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_getBoundingClientRect_9073b0ff7574d76b = function(arg0) {
            const ret = arg0.getBoundingClientRect();
            return ret;
        };
        imports.wbg.__wbg_getCoalescedEvents_a7d49de30111f6b8 = function(arg0) {
            const ret = arg0.getCoalescedEvents();
            return ret;
        };
        imports.wbg.__wbg_getCoalescedEvents_ad74da26d81a76af = function(arg0) {
            const ret = arg0.getCoalescedEvents;
            return ret;
        };
        imports.wbg.__wbg_getComputedStyle_046dd6472f8e7f1d = function() { return handleError(function (arg0, arg1) {
            const ret = arg0.getComputedStyle(arg1);
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments) };
        imports.wbg.__wbg_getOwnPropertyDescriptor_9dd936a3c0cbd368 = function(arg0, arg1) {
            const ret = Object.getOwnPropertyDescriptor(arg0, arg1);
            return ret;
        };
        imports.wbg.__wbg_getPropertyValue_e623c23a05dfb30c = function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg1.getPropertyValue(getStringFromWasm0(arg2, arg3));
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments) };
        imports.wbg.__wbg_getRandomValues_bcb4912f16000dc4 = function() { return handleError(function (arg0, arg1) {
            arg0.getRandomValues(arg1);
        }, arguments) };
        imports.wbg.__wbg_get_b9b93047fe3cf45b = function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        };
        imports.wbg.__wbg_height_1f8226c8f6875110 = function(arg0) {
            const ret = arg0.height;
            return ret;
        };
        imports.wbg.__wbg_inlineSize_8ff96b3ec1b24423 = function(arg0) {
            const ret = arg0.inlineSize;
            return ret;
        };
        imports.wbg.__wbg_instanceof_HtmlCanvasElement_2ea67072a7624ac5 = function(arg0) {
            let result;
            try {
                result = arg0 instanceof HTMLCanvasElement;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_instanceof_Response_f2cc20d9f7dfd644 = function(arg0) {
            let result;
            try {
                result = arg0 instanceof Response;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_instanceof_Window_def73ea0955fc569 = function(arg0) {
            let result;
            try {
                result = arg0 instanceof Window;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_isIntersecting_e68706dac9c5f2e9 = function(arg0) {
            const ret = arg0.isIntersecting;
            return ret;
        };
        imports.wbg.__wbg_is_c7481c65e7e5df9e = function(arg0, arg1) {
            const ret = Object.is(arg0, arg1);
            return ret;
        };
        imports.wbg.__wbg_key_7b5c6cb539be8e13 = function(arg0, arg1) {
            const ret = arg1.key;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_length_a446193dc22c12f8 = function(arg0) {
            const ret = arg0.length;
            return ret;
        };
        imports.wbg.__wbg_length_e2d2a49132c1b256 = function(arg0) {
            const ret = arg0.length;
            return ret;
        };
        imports.wbg.__wbg_location_9b435486be8f98c2 = function(arg0) {
            const ret = arg0.location;
            return ret;
        };
        imports.wbg.__wbg_log_0cc1b7768397bcfe = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.log(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3), getStringFromWasm0(arg4, arg5), getStringFromWasm0(arg6, arg7));
            } finally {
                wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            }
        };
        imports.wbg.__wbg_log_cb9e190acc5753fb = function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.log(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            }
        };
        imports.wbg.__wbg_mark_7438147ce31e9d4b = function(arg0, arg1) {
            performance.mark(getStringFromWasm0(arg0, arg1));
        };
        imports.wbg.__wbg_matchMedia_bf8807a841d930c1 = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.matchMedia(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments) };
        imports.wbg.__wbg_matches_e9ca73fbf8a3a104 = function(arg0) {
            const ret = arg0.matches;
            return ret;
        };
        imports.wbg.__wbg_measure_fb7825c11612c823 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
            let deferred0_0;
            let deferred0_1;
            let deferred1_0;
            let deferred1_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                deferred1_0 = arg2;
                deferred1_1 = arg3;
                performance.measure(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
            } finally {
                wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
                wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
            }
        }, arguments) };
        imports.wbg.__wbg_media_552eec81313ef78b = function(arg0, arg1) {
            const ret = arg1.media;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_metaKey_0b25f7848e014cc8 = function(arg0) {
            const ret = arg0.metaKey;
            return ret;
        };
        imports.wbg.__wbg_metaKey_e1dd47d709a80ce5 = function(arg0) {
            const ret = arg0.metaKey;
            return ret;
        };
        imports.wbg.__wbg_movementX_1aa05f864931369b = function(arg0) {
            const ret = arg0.movementX;
            return ret;
        };
        imports.wbg.__wbg_movementY_8acfedb38a70e624 = function(arg0) {
            const ret = arg0.movementY;
            return ret;
        };
        imports.wbg.__wbg_msCrypto_0a36e2ec3a343d26 = function(arg0) {
            const ret = arg0.msCrypto;
            return ret;
        };
        imports.wbg.__wbg_navigator_1577371c070c8947 = function(arg0) {
            const ret = arg0.navigator;
            return ret;
        };
        imports.wbg.__wbg_new_18b1151f3a6a9280 = function() { return handleError(function (arg0) {
            const ret = new IntersectionObserver(arg0);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_new_24b2c5b645cded8d = function() { return handleError(function () {
            const ret = new MessageChannel();
            return ret;
        }, arguments) };
        imports.wbg.__wbg_new_405e22f390576ce2 = function() {
            const ret = new Object();
            return ret;
        };
        imports.wbg.__wbg_new_5f34cc0c99fcc488 = function() { return handleError(function (arg0) {
            const ret = new ResizeObserver(arg0);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
            const ret = new Error();
            return ret;
        };
        imports.wbg.__wbg_new_a12002a7f91c75be = function(arg0) {
            const ret = new Uint8Array(arg0);
            return ret;
        };
        imports.wbg.__wbg_new_b1a33e5095abf678 = function() { return handleError(function (arg0, arg1) {
            const ret = new Worker(getStringFromWasm0(arg0, arg1));
            return ret;
        }, arguments) };
        imports.wbg.__wbg_new_e25e5aab09ff45db = function() { return handleError(function () {
            const ret = new AbortController();
            return ret;
        }, arguments) };
        imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
            const ret = new Function(getStringFromWasm0(arg0, arg1));
            return ret;
        };
        imports.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
            const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
            return ret;
        };
        imports.wbg.__wbg_newwithlength_a381634e90c276d4 = function(arg0) {
            const ret = new Uint8Array(arg0 >>> 0);
            return ret;
        };
        imports.wbg.__wbg_newwithstrsequenceandoptions_aaff55b467c81b63 = function() { return handleError(function (arg0, arg1) {
            const ret = new Blob(arg0, arg1);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_node_02999533c4ea02e3 = function(arg0) {
            const ret = arg0.node;
            return ret;
        };
        imports.wbg.__wbg_now_2c95c9de01293173 = function(arg0) {
            const ret = arg0.now();
            return ret;
        };
        imports.wbg.__wbg_observe_d2e7378f15f7ca72 = function(arg0, arg1) {
            arg0.observe(arg1);
        };
        imports.wbg.__wbg_observe_eafddfc5a0c60e02 = function(arg0, arg1) {
            arg0.observe(arg1);
        };
        imports.wbg.__wbg_observe_ed4adb1c245103c5 = function(arg0, arg1, arg2) {
            arg0.observe(arg1, arg2);
        };
        imports.wbg.__wbg_of_2eaf5a02d443ef03 = function(arg0) {
            const ret = Array.of(arg0);
            return ret;
        };
        imports.wbg.__wbg_of_66b3ee656cbd962b = function(arg0, arg1) {
            const ret = Array.of(arg0, arg1);
            return ret;
        };
        imports.wbg.__wbg_offsetX_989d29ed9335c7d0 = function(arg0) {
            const ret = arg0.offsetX;
            return ret;
        };
        imports.wbg.__wbg_offsetY_88f270098a180ce3 = function(arg0) {
            const ret = arg0.offsetY;
            return ret;
        };
        imports.wbg.__wbg_performance_7a3ffd0b17f663ad = function(arg0) {
            const ret = arg0.performance;
            return ret;
        };
        imports.wbg.__wbg_persisted_d32ce73b8e522062 = function(arg0) {
            const ret = arg0.persisted;
            return ret;
        };
        imports.wbg.__wbg_play_d475dddcc8433e39 = function(arg0) {
            arg0.play();
        };
        imports.wbg.__wbg_pointerId_585e63ee80a49927 = function(arg0) {
            const ret = arg0.pointerId;
            return ret;
        };
        imports.wbg.__wbg_pointerType_6bd934aa20d9db49 = function(arg0, arg1) {
            const ret = arg1.pointerType;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_port1_70af0ea6e4a96f9d = function(arg0) {
            const ret = arg0.port1;
            return ret;
        };
        imports.wbg.__wbg_port2_0584c7f0938b6fe6 = function(arg0) {
            const ret = arg0.port2;
            return ret;
        };
        imports.wbg.__wbg_postMessage_e55d059efb191dc5 = function() { return handleError(function (arg0, arg1) {
            arg0.postMessage(arg1);
        }, arguments) };
        imports.wbg.__wbg_postMessage_f961e53b9731ca83 = function() { return handleError(function (arg0, arg1, arg2) {
            arg0.postMessage(arg1, arg2);
        }, arguments) };
        imports.wbg.__wbg_postTask_d51b4581f8f06154 = function(arg0, arg1, arg2) {
            const ret = arg0.postTask(arg1, arg2);
            return ret;
        };
        imports.wbg.__wbg_pressure_adda5a83a9cec94d = function(arg0) {
            const ret = arg0.pressure;
            return ret;
        };
        imports.wbg.__wbg_preventDefault_c2314fd813c02b3c = function(arg0) {
            arg0.preventDefault();
        };
        imports.wbg.__wbg_process_5c1d670bc53614b8 = function(arg0) {
            const ret = arg0.process;
            return ret;
        };
        imports.wbg.__wbg_prototype_52a6e43569c41398 = function() {
            const ret = ResizeObserverEntry.prototype;
            return ret;
        };
        imports.wbg.__wbg_querySelector_c69f8b573958906b = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.querySelector(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments) };
        imports.wbg.__wbg_queueMicrotask_65a6c48ee9790d40 = function(arg0, arg1) {
            arg0.queueMicrotask(arg1);
        };
        imports.wbg.__wbg_queueMicrotask_97d92b4fcc8a61c5 = function(arg0) {
            queueMicrotask(arg0);
        };
        imports.wbg.__wbg_queueMicrotask_d3219def82552485 = function(arg0) {
            const ret = arg0.queueMicrotask;
            return ret;
        };
        imports.wbg.__wbg_randomFillSync_ab2cfe79ebbf2740 = function() { return handleError(function (arg0, arg1) {
            arg0.randomFillSync(arg1);
        }, arguments) };
        imports.wbg.__wbg_removeEventListener_056dfe8c3d6c58f9 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
            arg0.removeEventListener(getStringFromWasm0(arg1, arg2), arg3);
        }, arguments) };
        imports.wbg.__wbg_removeListener_e55db581b73ccf65 = function() { return handleError(function (arg0, arg1) {
            arg0.removeListener(arg1);
        }, arguments) };
        imports.wbg.__wbg_removeProperty_0e85471f4dfc00ae = function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg1.removeProperty(getStringFromWasm0(arg2, arg3));
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments) };
        imports.wbg.__wbg_repeat_1882aa0d0072c705 = function(arg0) {
            const ret = arg0.repeat;
            return ret;
        };
        imports.wbg.__wbg_requestAnimationFrame_d7fd890aaefc3246 = function() { return handleError(function (arg0, arg1) {
            const ret = arg0.requestAnimationFrame(arg1);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_requestFullscreen_900816ce59bc23ee = function(arg0) {
            const ret = arg0.requestFullscreen;
            return ret;
        };
        imports.wbg.__wbg_requestFullscreen_cb251917d11c059d = function(arg0) {
            const ret = arg0.requestFullscreen();
            return ret;
        };
        imports.wbg.__wbg_requestIdleCallback_67a4ae09ea470b9f = function(arg0) {
            const ret = arg0.requestIdleCallback;
            return ret;
        };
        imports.wbg.__wbg_requestIdleCallback_e3eefd34962470e1 = function() { return handleError(function (arg0, arg1) {
            const ret = arg0.requestIdleCallback(arg1);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_requestPointerLock_304dd9ccfe548767 = function(arg0) {
            arg0.requestPointerLock();
        };
        imports.wbg.__wbg_require_79b1e9274cde3c87 = function() { return handleError(function () {
            const ret = module.require;
            return ret;
        }, arguments) };
        imports.wbg.__wbg_resolve_4851785c9c5f573d = function(arg0) {
            const ret = Promise.resolve(arg0);
            return ret;
        };
        imports.wbg.__wbg_revokeObjectURL_27267efebeb457c7 = function() { return handleError(function (arg0, arg1) {
            URL.revokeObjectURL(getStringFromWasm0(arg0, arg1));
        }, arguments) };
        imports.wbg.__wbg_scheduler_3dbf209fc08aa5b8 = function(arg0) {
            const ret = arg0.scheduler;
            return ret;
        };
        imports.wbg.__wbg_scheduler_798ad2c2c23a54ad = function(arg0) {
            const ret = arg0.scheduler;
            return ret;
        };
        imports.wbg.__wbg_setAttribute_2704501201f15687 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            arg0.setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        }, arguments) };
        imports.wbg.__wbg_setPointerCapture_c04dafaf4d00ffad = function() { return handleError(function (arg0, arg1) {
            arg0.setPointerCapture(arg1);
        }, arguments) };
        imports.wbg.__wbg_setProperty_f2cf326652b9a713 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            arg0.setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        }, arguments) };
        imports.wbg.__wbg_setTimeout_461fec76662b35ea = function() { return handleError(function (arg0, arg1) {
            const ret = arg0.setTimeout(arg1);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_setTimeout_f2fe5af8e3debeb3 = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.setTimeout(arg1, arg2);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
            arg0.set(arg1, arg2 >>> 0);
        };
        imports.wbg.__wbg_set_bb8cecf6a62b9f46 = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(arg0, arg1, arg2);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_setbox_2786f3ccea97cac4 = function(arg0, arg1) {
            arg0.box = __wbindgen_enum_ResizeObserverBoxOptions[arg1];
        };
        imports.wbg.__wbg_setonmessage_23d122da701b8ddb = function(arg0, arg1) {
            arg0.onmessage = arg1;
        };
        imports.wbg.__wbg_settype_39ed370d3edd403c = function(arg0, arg1, arg2) {
            arg0.type = getStringFromWasm0(arg1, arg2);
        };
        imports.wbg.__wbg_shiftKey_2bebb3b703254f47 = function(arg0) {
            const ret = arg0.shiftKey;
            return ret;
        };
        imports.wbg.__wbg_shiftKey_86e737105bab1a54 = function(arg0) {
            const ret = arg0.shiftKey;
            return ret;
        };
        imports.wbg.__wbg_signal_aaf9ad74119f20a4 = function(arg0) {
            const ret = arg0.signal;
            return ret;
        };
        imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
            const ret = arg1.stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_start_2c099369ce831bf1 = function(arg0) {
            arg0.start();
        };
        imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
            const ret = typeof global === 'undefined' ? null : global;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
            const ret = typeof globalThis === 'undefined' ? null : globalThis;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
            const ret = typeof self === 'undefined' ? null : self;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
            const ret = typeof window === 'undefined' ? null : window;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_status_f6360336ca686bf0 = function(arg0) {
            const ret = arg0.status;
            return ret;
        };
        imports.wbg.__wbg_stringify_f7ed6987935b4a24 = function() { return handleError(function (arg0) {
            const ret = JSON.stringify(arg0);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_style_fb30c14e5815805c = function(arg0) {
            const ret = arg0.style;
            return ret;
        };
        imports.wbg.__wbg_subarray_aa9065fa9dc5df96 = function(arg0, arg1, arg2) {
            const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
            return ret;
        };
        imports.wbg.__wbg_then_44b73946d2fb3e7d = function(arg0, arg1) {
            const ret = arg0.then(arg1);
            return ret;
        };
        imports.wbg.__wbg_then_48b406749878a531 = function(arg0, arg1, arg2) {
            const ret = arg0.then(arg1, arg2);
            return ret;
        };
        imports.wbg.__wbg_unobserve_02f53d1ca2d1d801 = function(arg0, arg1) {
            arg0.unobserve(arg1);
        };
        imports.wbg.__wbg_userAgentData_0ba21969d1f27636 = function(arg0) {
            const ret = arg0.userAgentData;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_userAgent_12e9d8e62297563f = function() { return handleError(function (arg0, arg1) {
            const ret = arg1.userAgent;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments) };
        imports.wbg.__wbg_versions_c71aa1626a93e0a1 = function(arg0) {
            const ret = arg0.versions;
            return ret;
        };
        imports.wbg.__wbg_visibilityState_f3cc18a6f3831137 = function(arg0) {
            const ret = arg0.visibilityState;
            return (__wbindgen_enum_VisibilityState.indexOf(ret) + 1 || 3) - 1;
        };
        imports.wbg.__wbg_webkitExitFullscreen_dcb418d2357698e2 = function(arg0) {
            arg0.webkitExitFullscreen();
        };
        imports.wbg.__wbg_webkitFullscreenElement_1705b28e33fad768 = function(arg0) {
            const ret = arg0.webkitFullscreenElement;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_webkitRequestFullscreen_416bc13a99f0f3ed = function(arg0) {
            arg0.webkitRequestFullscreen();
        };
        imports.wbg.__wbg_width_cdaf02311c1621d1 = function(arg0) {
            const ret = arg0.width;
            return ret;
        };
        imports.wbg.__wbg_x_2bc3f61e11d9f2e1 = function(arg0) {
            const ret = arg0.x;
            return ret;
        };
        imports.wbg.__wbg_y_be10a4f665290032 = function(arg0) {
            const ret = arg0.y;
            return ret;
        };
        imports.wbg.__wbindgen_cb_drop = function(arg0) {
            const obj = arg0.original;
            if (obj.cnt-- == 1) {
                obj.a = 0;
                return true;
            }
            const ret = false;
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper54815 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 4906, __wbg_adapter_30);
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper54816 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 4906, __wbg_adapter_33);
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper54820 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 4906, __wbg_adapter_33);
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper54824 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 4906, __wbg_adapter_33);
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper54825 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 4906, __wbg_adapter_33);
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper54826 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 4906, __wbg_adapter_33);
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper54835 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 4906, __wbg_adapter_44);
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper54838 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 4906, __wbg_adapter_33);
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper60437 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 4906, __wbg_adapter_33);
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper61607 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 4906, __wbg_adapter_33);
            return ret;
        };
        imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
            const ret = debugString(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbindgen_init_externref_table = function() {
            const table = wasm.__wbindgen_export_1;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
            ;
        };
        imports.wbg.__wbindgen_is_function = function(arg0) {
            const ret = typeof(arg0) === 'function';
            return ret;
        };
        imports.wbg.__wbindgen_is_object = function(arg0) {
            const val = arg0;
            const ret = typeof(val) === 'object' && val !== null;
            return ret;
        };
        imports.wbg.__wbindgen_is_string = function(arg0) {
            const ret = typeof(arg0) === 'string';
            return ret;
        };
        imports.wbg.__wbindgen_is_undefined = function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        };
        imports.wbg.__wbindgen_memory = function() {
            const ret = wasm.memory;
            return ret;
        };
        imports.wbg.__wbindgen_number_new = function(arg0) {
            const ret = arg0;
            return ret;
        };
        imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        };
        imports.wbg.__wbindgen_throw = function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        };

        return imports;
    }

    function __wbg_init_memory(imports, memory) {

    }

    function __wbg_finalize_init(instance, module) {
        wasm = instance.exports;
        __wbg_init.__wbindgen_wasm_module = module;
        cachedDataViewMemory0 = null;
        cachedUint8ArrayMemory0 = null;


        wasm.__wbindgen_start();
        return wasm;
    }

    function initSync(module) {
        if (wasm !== undefined) return wasm;


        if (typeof module !== 'undefined') {
            if (Object.getPrototypeOf(module) === Object.prototype) {
                ({module} = module)
            } else {
                console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
            }
        }

        const imports = __wbg_get_imports();

        __wbg_init_memory(imports);

        if (!(module instanceof WebAssembly.Module)) {
            module = new WebAssembly.Module(module);
        }

        const instance = new WebAssembly.Instance(module, imports);

        return __wbg_finalize_init(instance, module);
    }

    async function __wbg_init(module_or_path) {
        if (wasm !== undefined) return wasm;


        if (typeof module_or_path !== 'undefined') {
            if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
                ({module_or_path} = module_or_path)
            } else {
                console.warn('using deprecated parameters for the initialization function; pass a single object instead')
            }
        }

        if (typeof module_or_path === 'undefined' && typeof script_src !== 'undefined') {
            module_or_path = script_src.replace(/\.js$/, '_bg.wasm');
        }
        const imports = __wbg_get_imports();

        if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
            module_or_path = fetch(module_or_path);
        }

        __wbg_init_memory(imports);

        const { instance, module } = await __wbg_load(await module_or_path, imports);

        return __wbg_finalize_init(instance, module);
    }

    wasm_bindgen = Object.assign(__wbg_init, { initSync }, __exports);

})();
