# OneDrive E5 / 365 Edition SharePoint Direct Link Project

## 介绍

本项目旨在解决通过E5开发者订阅得到的OneDrive 获取文件直链的问题。

对于个人版用于，文件的直链将类似于 `http://storage.live.com/items/${file.id}:/${file.name}`

强烈建议使用 [获取OneDrive直链 (mapaler.github.io)](https://mapaler.github.io/GetOneDriveDirectLink/) 项目获取个人版文件直链，支持批量获取。

但是由于该作者没有Office365账号，而OneDrive在Office365版本下的api完全不同，上面的项目不再使用。

经过测试，以下是我发现的365版本OneDrive文件直链获取方式。

## 获取直链的方法

1. 分享一个文件，复制它的原始链接。它大概会长成这样

   ```
   https://uconix-my.sharepoint.com/:i:/g/personal/conix_conix_tk/EZyke9CHRJVBvYnZVv5B9XgBZ5nFlDOabxR9OMY7kzbGig?e=ggi2zZ
   ```

   这个url及其丑陋，并且我们如果直接访问，它会到达OneDrive的官方预览界面

   ![官方预览](https://gitee.com/Wuuconix/image_host/raw/master/image-20220306143250554.png)

   这不是我们预期的直链，这个链接我们无法用在博客中进行直链。

2. 通过搜索，我在[Get direct download link of a file in OneDrive for Business - Microsoft Tech Community](https://techcommunity.microsoft.com/t5/onedrive-for-business/get-direct-download-link-of-a-file-in-onedrive-for-business/m-p/149766)里找到了解决方法。

   我们只要把分享链接最后的`?e=ggi2zZ`之类的东西删掉，然后加上`?download=1`

   即

   ```
   https://uconix-my.sharepoint.com/:i:/g/personal/conix_conix_tk/EZyke9CHRJVBvYnZVv5B9XgBZ5nFlDOabxR9OMY7kzbGig?download=1
   ```

   这时，这个链接便成了一个下载直链（微软貌似会跳转到另一个链接实现在线预览

3. 实际上，我还发现了另一种格式的直链。

   发现的过程是，先访问官方分享链接，然后点击预览界面的下载，这时候我们复制下载链接就会得到类似下面的链接。

   ```
   https://uconix-my.sharepoint.com/personal/conix_conix_tk/_layouts/15/download.aspx?share=EZyke9CHRJVBvYnZVv5B9XgBZ5nFlDOabxR9OMY7kzbGig
   ```

   我们可以看到这个链接的结构比较工整，没有上面的直链有`/:i/g/`这种丑陋的东西。

   经过测试，每个分享文件的直链前面的部分全部是相同的。即`https://uconix-my.sharepoint.com/personal/conix_conix_tk/_layouts/15/download.aspx?share=`

   区别每个分享文件的ID就是这一串`EZyke9CHRJVBvYnZVv5B9XgBZ5nFlDOabxR9OMY7kzbGig`。我把它称为**shareCode**

   而且由于所有文件的直链前半部分都是完全相同的，我们完全可以开设一个服务来rediret。

   比如我在CloudFlare上开了个worker，现在实现访问`https://1drv.conix.tk/EZyke9CHRJVBvYnZVv5B9XgBZ5nFlDOabxR9OMY7kzbGig`就会redirect到`https://uconix-my.sharepoint.com/personal/conix_conix_tk/_layouts/15/download.aspx?share=EZyke9CHRJVBvYnZVv5B9XgBZ5nFlDOabxR9OMY7kzbGig`上。

   此外，我还模拟了短链站的效果，用4位字符(大小写字母+数字)来实现短链。

   例如访问`https://1drv.conix.tk/0XDx`和`https://1drv.conix.tk/EZyke9CHRJVBvYnZVv5B9XgBZ5nFlDOabxR9OMY7kzbGig`是一样的操作，更加减少了直链的长度，增加了美观程序。

## 本仓库的作用

由于得到文件直链的关键在于获得分享文件的shareCode。

该项目就能够实现直接复制原分享链接自动提取出链接中的shareCode，然后自动将结果复制到剪切板中。

![效果](https://gitee.com/Wuuconix/image_host/raw/master/image-20220306145825873.png)

## 注意

本项目目前仅适合作者自己使用。

若想实现类似的操作，需要自行魔改代码并且自行CloudFlare Worker Serverless服务