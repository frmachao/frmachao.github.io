#  Mac OS 终端安装、使用 oh My zsh 

## 前言

在上次写[记 gulp-imagemin 安装时遇到的问题](https://github.com/frmachao/blog/issues/8) 这篇笔记的时候,当时遇到了在.profile_bash 里配置终端代理总是不生效，然后就查，结果发现是苹果电脑从 macOS Catalina 版开始(Version 10.15+),Mac OS 将zsh 作为默认 Shell，就是说人家的配置人家改成.zshrc 和 .zprofile 了😫。

> 苹果官网的这篇文档[在 Mac 上将 zsh 用作默认 Shel](https://support.apple.com/zh-cn/HT208050)

然后我继续查这个`zsh` 是啥，为啥新系统默认是它，难道有啥优势，然后就查到一个 叫 oh my zsh 的开源项目，内置了一堆好用的插件和主题。这篇笔记就是记录一下 Mac 上 终端配置 zsh。

## 终端配置（Terminal）

zsh 的配置文件 `.zshrc` 和 `.zprofile`

但是注意这里有两种 分别是系统根目录下的配置 /etc/.zshrc 和 用户根目录的配置 ～/.zhsrc，我看文档说一般只要配置～/.zshrc 就够了

在网上查了zsh 发现都推荐使用 `Oh My Zsh`来配置 zsh，配置文件还是在 .zshrc,编辑完后执行`source ~/.zshrc`即可生效
### 安装 oh My zsh
> [oh my zsh](https://github.com/ohmyzsh/ohmyzsh)
```bash
# 通过 curl 安装
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# 或者通过wget 安装
sh -c "$(wget -O- https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```
### zsh 主题与插件
> oh my zsh 中内置了很多主题和插件 但是需要你去 .zshrc 中配置来开启

- 插件目录 /Users/ma/.oh-my-zsh/plugins
- 主题目录 /Users/ma/.oh-my-zsh/themes

你可以安装社区里的其他插件与主题但是要额外安装，我就没有折腾
```bash
# ~/.zshrc
# 请注意，这些插件之间用空格分隔，不要在它们之间使用逗号。
plugins=(
  git
  osx
  nvm
)
ZSH_THEME="agnoster" # (this is one of the fancy ones)
# see https://github.com/ohmyzsh/ohmyzsh/wiki/Themes#agnoster
```
执行`source ~/.zshrc`

我使用的是一款叫 `agnoster` 的主题
注意：需要额外安装 Powerline 字体[ Powerline Fonts](https://github.com/powerline/fonts)
```bash
# macOS中安装方式
# clone
git clone https://github.com/powerline/fonts.git --depth=1
# install
cd fonts
./install.sh
# clean-up a bit
cd ..
rm -rf fonts
```

安装后要去终端偏好设置里配置一下，字体，字体选择 powerline

配置好的效果

[![YSNXCT.md.png](https://s1.ax1x.com/2020/05/03/YSNXCT.md.png)](https://imgchr.com/i/YSNXCT)

**Zsh中将全路径缩短为当前文件夹名**

有时候经常嫌一层一层目录实在太长太占地方，而且截屏时也不方便把全路径显示出来。所以需要隐藏起来会比较方便，需要看全路径的话一句pwd就显示了。

Zsh中，配置文件~/.zshrc里面可以配置DEFAULT_USER=$USER来隐藏用户名和主机名，下面还有一句prompt_context() {}设定一般来说是可以写入函数来隐藏全路径并只显示当前文件夹的。

但是配置了agnoster配色主题后，怎么修改好像都没用，[参考这篇文章](https://www.jianshu.com/p/ee442cb4d6c2)，得知，只要到agnoster配色主题的配置文件中改一个字即可：
找到文件：一般是在这个位置`~/.oh-my-zsh/themes/agnoster.zsh-theme`，打开后找到`prompt_dir() {}`这个函数，然后将`prompt_segment blue black '%~'`最后面的~改为c即可：`prompt_segment blue black '%c'`。

[![YS03wj.png](https://s1.ax1x.com/2020/05/03/YS03wj.png)](https://imgchr.com/i/YS03wj)

最终效果：

[![YSD9qe.md.png](https://s1.ax1x.com/2020/05/03/YSD9qe.md.png)](https://imgchr.com/i/YSD9qe)