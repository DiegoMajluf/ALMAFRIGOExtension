This is an extension for use internally in ALMAFRIGO

It allows to make silent print y read some intranet device information to use in our applications


To reproduce to code generated

npm i
npm run build

How to silently print, you must have active google cloud print and make a post to the extension

browser.runtime.sendMessage('gdkkodmnljpemnhhimkjbiadblpepgag', 
                { 
                    op: 'printDocs', 
                    value: {
                        titulo: string,
                        jobid: string,
                        ticket: <GCP Ticket>,
                        printerId: <printerId>,
                        token: <google token>,
                        base64Content: string
                    } 
                }, resp =>  callBack && callBack(resp.status, resp.response))


