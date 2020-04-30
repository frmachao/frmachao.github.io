/* 
相关依赖
"gulp": "^4.0.2",
"gulp-babel": "^8.0.0-beta.2",
"@babel/core": "^7.6.4",
"@babel/preset-env": "^7.6.3", 
*/
const gulp = require('gulp');
const babel = require("gulp-babel");

const paths = {
    build: 'dist',
    test: 'test/**/*.js'
};
gulp.task('test', () => {
    return gulp.src(paths.test)
        .pipe(babel({
            presets: [
                [
                    "@babel/preset-env",
                    {
                        targets: {
                            // ie: 8,
                            "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
                        },
                        useBuiltIns: 'usage',
                        corejs: { version: 3 }
                    }
                ]
            ],
            plugins: [
                // 避免在编译后的输出中重复代码 以及 避免全局变量污染
                ["@babel/plugin-transform-runtime", {
                    corejs: { version: 3, proposals: true }
                }]
            ],
            exclude: [/node_modules/],
        }
        ))
        .pipe(gulp.dest(paths.build));
})
