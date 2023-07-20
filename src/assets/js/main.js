//= components/script.js

import Dropzone from 'dropzone'

document.addEventListener('DOMContentLoaded', () => {
    personalHeight()
    initTogglers()
    initTableTogglers()
    initBurger()
    initChooses()
    popups()
    initChoices()
    importerClicks()
    initChoicesLinks()
    initQuantity()
    initProgressBars()
    initFlatpickr()
    initPasswords()
    initWindowoverflowRight()
    initInputsWrite()
    initOrderFixed()
    initDropZones()
})

const body = document.querySelector('body')
window.initChoices = initChoices

function initChoices() {
	const elements = document.querySelectorAll('.choices');

    if (!elements) return

	elements.forEach(x => {
		const choices = new Choices(x, 
		{
			searchEnabled: false,
			itemSelectText: '',
			shouldSort: false,
            callbackOnCreateTemplates: function(template) {
				return {
					item: ({ classNames }, data) => {
					  return template(`
						<div class="${classNames.item} ${
						data.highlighted
						  ? classNames.highlightedState
						  : classNames.itemSelectable
					  } ${
						data.placeholder ? classNames.placeholder : ''
					  }" data-item data-id="${data.id}" data-value="${data.value}" ${
						data.active ? 'aria-selected="true"' : ''
					  } ${data.disabled ? 'aria-disabled="true"' : ''}
					  ${data.customProperties.check ? 'data-check="true"' : ''}>
						   ${data.label}
						</div>
					  `);
					},
					choice: ({ classNames }, data) => {
					  return template(`
						<${data.customProperties.check ? 'a href="' + data.value + '"' : 'div'} class="${classNames.item} ${classNames.itemChoice} ${
						data.disabled ? classNames.itemDisabled : classNames.itemSelectable
					  }" data-select-text="${this.config.itemSelectText}" data-choice ${
						data.disabled
						  ? 'data-choice-disabled aria-disabled="true"'
						  : 'data-choice-selectable'
					  } data-id="${data.id}" data-value="${data.value}" ${
						data.groupId > 0 ? 'role="treeitem"' : 'role="option"'
					  }
					  ${data.customProperties.check ? 'data-check="true"' : ''}>
						   ${data.label}
						</${data.customProperties.check ? 'a' : 'div'}>
					  `);
					},
				};
			},
        })
	})
}

function initChoicesLinks() {
    let optionLinks = document.querySelectorAll('[data-check]')

    if (!optionLinks) return

    optionLinks.forEach(x => x.addEventListener('mousedown', () => {
        window.location.href = x.dataset.value
    }))
}

function initFlatpickr() {
    // flatpickr(".date-picker", {});
    flatpickr(".date-picker", {
        
        wrap: true,
        dateFormat: "d.m.Y",
        disableMobile: "true",
        "locale": {
            "firstDayOfWeek": 1
        },
    });
}

function personalHeight() {
    const personal = document.querySelector('.personal-opened')
    body.style.setProperty('--personal-height', personal.scrollHeight + 'px');
}

function initChooses() {
    let chooses = document.querySelectorAll('.radio-choose')

    if (chooses) {
        chooses.forEach(x => {
            let items = x.querySelectorAll('li')

            items.forEach(item => item.addEventListener('click', () => {
                currentItem = item
                items.forEach(x => x.classList.remove('active'))
                currentItem.classList.add('active')
            }))

            let marker = x.querySelector('#marker')

            marker.style.left = x.querySelector('li.active').offsetLeft+'px';
            marker.style.width = x.querySelector('li.active').offsetWidth+'px';

            function indicator(e) {
                marker.style.left = e.offsetLeft+'px';
                marker.style.width = e.offsetWidth+'px';
            }

            items.forEach(link => {
                link.addEventListener('click', (e) => {
                    indicator(e.target)
                })
            })
        })
    }
}

function popups() {
    let openers = document.querySelectorAll('[data-popup-opener]')
    let closers = document.querySelectorAll('[data-popup-closer]')
    let allOpenedPopups = document.querySelectorAll('.opened[data-popup-content]')
    let shade = document.querySelector('.shade')

    function closePopups() {
        allOpenedPopups.forEach(x => x.classList.remove('opened'))
    }

    closers.forEach(x => x.addEventListener('click', () => {
        let target = x.dataset.popupCloser;
        let popup = document.querySelectorAll(`[data-popup-content="${target}"]`)

        popup.forEach(x => x.classList.remove('opened'))
        shade.classList.remove('active')
        body.classList.remove('fixed')
        document.querySelector('.main').classList.remove('notify-opened')
    }))

    openers.forEach(x => x.addEventListener('click', (e) => {
        e.stopPropagation()
        closePopups()
        let target = x.dataset.popupOpener;
        let popup = document.querySelector(`[data-popup-content="${target}"]`)

        x.classList.add('active')
        popup.classList.add('opened')
        body.classList.toggle('fixed')

        if(x.hasAttribute('data-shade')) {
            shade.classList.add('active')
        }

        if (x == document.querySelector('.notifications') && window.screen.width > 1620) {
            document.querySelector('.main').classList.toggle('notify-opened')
        }

        document.addEventListener('click', (e) => {
            const clickInside = e.composedPath().includes(popup)

            if (!clickInside) {
                x.classList.remove('active')
                popup.classList.remove('opened')
                shade.classList.remove('active')
                body.classList.remove('fixed')
                document.querySelector('.main').classList.remove('notify-opened')
            }
        })
    }))

    closers.forEach(x => x.addEventListener('click', () => {
        closePopups()

        body.classList.remove('fixed')
    }))
}

function initTogglers() {
    let togglers = document.querySelectorAll('[data-toggler]')

    if (togglers) {
        togglers.forEach(x => x.addEventListener('click', () => {
            let content = x.querySelector('[data-content]')
            
            x.classList.toggle('opened')
            content.classList.toggle('opened')

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else (content.style.maxHeight = content.scrollHeight + 'px')
        }))
    }
}

// открывашка инфы в таблице
function initTableTogglers() {
    let togglers = document.querySelectorAll('[data-table-toggler]')
    let shade = document.querySelector('.shade')

    function initTableTogglersInit() {
        if (togglers && window.screen.width > 768) {
            togglers.forEach(x => x.addEventListener('click', () => {
                let par = x.closest('[data-toggle]')
                let content = par.querySelector('[data-table-content]')

                x.classList.toggle('opened')
                par.classList.toggle('opened')

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else (content.style.maxHeight = content.scrollHeight + 'px')
            }))
        } else if (togglers && window.screen.width <= 768) {
            // меняем скрипт на мобиле
            togglers.forEach(x => x.addEventListener('click', () => {
                let par = x.closest('[data-toggle]')
                let content = par.querySelector('[data-table-content]')
                let closer = par.querySelector('[data-table-closer]')

                x.classList.toggle('opened')
                par.classList.toggle('opened')
                shade.classList.toggle('active')
                body.classList.toggle('fixed')

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else (content.style.maxHeight = 'calc(100vh - 200px)')

                // функция закрытия попапа с инфой
                function closePopup() {
                    x.classList.remove('opened')
                    par.classList.remove('opened')
                    shade.classList.remove('active')
                    body.classList.remove('fixed')
                    content.style.maxHeight = null;
                }

                shade.addEventListener('click', () => {
                    closePopup()
                })

                closer.addEventListener('click', () => {
                    closePopup()
                })
            }))
        }      
    }

    initTableTogglersInit()

    window.addEventListener('resize', initTableTogglersInit)
}

function initBurger() {
    let burger = document.querySelector('[data-aside-toggler]')

    if (burger) {
        // клик на бургер - открывает меню
        burger.addEventListener('click', () => {
            document.querySelectorAll('[data-aside-content]').forEach(x => 
                x.classList.toggle('aside-closed'))
            // при закрытии сворачиваем все открытые спойлеры
            document.querySelectorAll('.aside-spoiler.opened').forEach(x => {
                x.classList.remove('opened')
                x.querySelector('[data-content]').classList.remove('opened')
                x.querySelector('[data-content]').style.maxHeight = null;
            })      
        })

        // если меню закрыто - клик на любой спойлер в виде иконки открывает и бургер
        if (body.classList.contains('aside-closed')) {
            document.querySelectorAll('.aside-spoiler').forEach(x => 
                x.addEventListener('click', () => {
                    document.querySelectorAll('[data-aside-content]').forEach(x => 
                        x.classList.remove('aside-closed')
                    )
                })
            )
        }
    }   

    if (window.screen.width > 1620) {
        document.querySelectorAll('[data-aside-content]').forEach(x => 
            x.classList.remove('aside-closed'))
    } else {
        document.querySelectorAll('[data-aside-content]').forEach(x => 
            x.classList.add('aside-closed'))
    }
    
    window.addEventListener('resize', () => {
        if (window.screen.width > 1620) {
            document.querySelectorAll('[data-aside-content]').forEach(x => 
                x.classList.remove('aside-closed'))
        } else {
            document.querySelectorAll('[data-aside-content]').forEach(x => 
                x.classList.add('aside-closed'))
        }
    })
}

function initQuantity() {
    let quantities = document.querySelectorAll('[data-quantity]')

    if (quantities) {
        quantities.forEach(x => {
            let plus = x.querySelector('.quantity-plus')
            let minus = x.querySelector('.quantity-minus')
            let input = x.querySelector('input')
    
            plus.addEventListener('click', () => {
                let inputValue = input.value
                let newValue = parseInt(inputValue) + parseInt(plus.dataset.step)

                input.value = newValue

                if (minus.classList.contains('disable')) {
                    minus.classList.remove('disable')
                } 
            })

            minus.addEventListener('click', () => {
                let inputValue = input.value
                let newValue = parseInt(inputValue) - parseInt(plus.dataset.step)

                if (newValue > 0) {
                    input.value = newValue
                } else {
                    input.value = 0
                    minus.classList.add('disable')
                }
            })
        })
    }   
}

function initWindowoverflowRight() {
    let opener = document.querySelector('[data-popup-opener="container-settings"]')
    let popup = document.querySelector('[data-popup-content="container-settings"]')

    if (!popup) return 

    window.addEventListener('resize', () => {
        if ((opener.offsetLeft + popup.offsetWidth) > window.screen.width) {
            popup.classList.add('right')
        } else popup.classList.remove('right')
    })
}

function initProgressBars() {
    let progressbars = document.querySelectorAll('[data-persent]')

    if (!progressbars) return

    progressbars.forEach(x => {
        x.style.width = x.dataset.persent + '%'
    })
}

function importerClicks() {
    let items = document.querySelectorAll('.container-tracking li')
    let mobileBtn = document.querySelector('.mobile-status-btn')
    let close = document.querySelector('.mobile-status-close')
    let ul = document.querySelector('.container-tracking')
    let shade = document.querySelector('.shade')

    if (!items) return

    function rewriteBtn() {
        if (document.querySelector('.container-tracking li.active')) {
            mobileBtn.innerHTML = document.querySelector('.container-tracking li.active').innerHTML
        }
    }

    rewriteBtn()

    function closeMobileStatus() {
        ul.style.maxHeight = null;
        ul.classList.remove('active')
        shade.classList.remove('active')
        body.classList.remove('fixed')
    }

    items.forEach(x => x.addEventListener('click', () => {
        items.forEach(x => x.classList.remove('active'))
        x.classList.add('active')

        rewriteBtn()
        closeMobileStatus()
    }))

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            ul.classList.toggle('active')
            if (ul.style.maxHeight) {
                ul.style.maxHeight = null;
            } else (ul.style.maxHeight = ul.scrollHeight + 'px')
            
            shade.classList.toggle('active')
            body.classList.toggle('fixed')
    
            shade.addEventListener('click', () => {
                closeMobileStatus()
            })
    
            close.addEventListener('click', () => {
                closeMobileStatus()
            })
        })
    }
}

function initPasswords() {
    let passwordEyes = document.querySelectorAll('.password-show')
    let passwordEyesOpened = document.querySelectorAll('.password-show.toggle')

    if (!passwordEyes) return

    passwordEyes.forEach(x => x.addEventListener('click', () => {
        let hidePassword = null
        
        if (x.previousElementSibling.getAttribute('type') == 'password') {
            x.previousElementSibling.setAttribute('type', 'text')
            x.classList.add('toggle')
            
            hidePassword = setTimeout(() => {
                x.previousElementSibling.setAttribute('type', 'password')
                x.classList.remove('toggle')
            }, 5000)
        } else {
            x.previousElementSibling.setAttribute('type', 'password')
            x.classList.remove('toggle')
            clearTimeout(hidePassword)
        }
    }))

    // passwordEyes.forEach(x => x.addEventListener('mouseleave', () => {
    //     x.previousElementSibling.setAttribute('type', 'password')
    //     x.classList.remove('toggle')
    // }))
}

function initInputsWrite() {
    let holders = document.querySelectorAll('.write-input-holder')

    if (!holders) return

    holders.forEach(x => {
        let toggler = x.querySelector('.input-readonly-write')
        let input = x.querySelector('input')

        toggler.addEventListener('click', () => {
            toggler.classList.toggle('active')

            if (input.hasAttribute('readonly')) {
                input.removeAttribute('readonly')
                input.focus()
            } else {
                input.setAttribute('readonly')
            }
            
        })
    })
}

function initOrderFixed() {
    let order = document.querySelector('.order-bg')

    if (!order) return

    let orderbtn = document.querySelector('.order-mobile-btn')
    let orderclose = document.querySelector('.order-mobile-close')
    let shade = document.querySelector('.shade')

    orderbtn.addEventListener('click', (e) => {
        order.classList.add('active')
        e.stopPropagation()

        if(window.screen.width < 768) {
            if (order.style.maxHeight) {
                order.style.maxHeight = null;
            } else (order.style.maxHeight = order.scrollHeight + 16 + 'px')
            shade.classList.add('active')
            body.classList.add('fixed')
        }

        document.addEventListener('click', (e) => {
            const clickInside = e.composedPath().includes(order)

            if (!clickInside && order.classList.contains('active')) {
                closeCart()
            }
        })

        shade.addEventListener('click', closeCart)
    })

    orderclose.addEventListener('click', closeCart)

    function closeCart() {
        order.style.maxHeight = null;
        order.classList.remove('active')
        shade.classList.remove('active')
        body.classList.remove('fixed')
    }

    function topMargin() {
        if(window.screen.width > 768) {
            // order.style.top = 96 - document.documentElement.scrollTop + 'px'
            order.style.height = 'calc(100vh - ' + (96 - document.documentElement.scrollTop) + 'px)'
        }
    }

    topMargin()

    window.addEventListener('scroll', () => {
        if (document.documentElement.scrollTop < 96) {
            topMargin()
        } else {
            order.style.height = '100vh'
        }
    })
}

function initDropZones() {
        
    var myDropzone = new Dropzone("#uploadImage", {
        url: "/",
        createImageThumbnails: false,
    });

    document.querySelector('button.dz-button').innerHTML = '<span class="green">Add file</span> or drop file here'
}