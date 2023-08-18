//= components/script.js

import Dropzone from 'dropzone'

document.addEventListener('DOMContentLoaded', () => {
    setBodyParams()
    initTogglers()
    initFilterTogglers()
    initTableTogglers()
    initBurger()
    initChooses()
    initPopups()
    initNotifications()
    initChoices()
    initImporterClicks()
    initChoicesLinks()
    initQuantity()
    initProgressBars()
    initFlatpickr()
    initPasswords()
    initWindowoverflowRight()
    initInputsWrite()
    initOrderFixed()
    initDropZones()
    initRangeInput()
    initDashboardCharts()
    onScrollHandler()
    initNotifySlider()
})

const body = document.querySelector('body')
const shade = document.querySelector('.shade')
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
    if (document.querySelector('.date-picker')) {
        flatpickr(".date-picker", { 
            wrap: true,
            dateFormat: "d.m.Y",
            disableMobile: "true",
            "locale": {
                "firstDayOfWeek": 1
            },
        });
    }
}

function setBodyParams() {
    let personal = document.querySelector('.personal-opened')

    if (!personal) return

    let header = document.querySelector('header')

    body.style.setProperty('--header-height', header.scrollHeight + 'px');
    body.style.setProperty('--personal-height', personal.scrollHeight + 'px');
}

function initChooses() {
    let chooses = document.querySelectorAll('.radio-choose')

    if (!chooses) return
    
    chooses.forEach(x => {
        let items = x.querySelectorAll('li')
        let marker = x.querySelector('#marker')

        marker.style.left = x.querySelector('li.active').offsetLeft+'px';
        marker.style.width = x.querySelector('li.active').offsetWidth+'px';

        function indicator(target) {
            marker.style.left = target.offsetLeft+'px';
            marker.style.width = target.offsetWidth+'px';
        }

        items.forEach(item => item.addEventListener('click', (e) => {
            items.forEach(x => x.classList.remove('active'))
            item.classList.add('active')
            indicator(item)
        }))
    })
}

function initPopups() {
    let openers = document.querySelectorAll('[data-popup-opener]')

    if (!openers) return

    let closers = document.querySelectorAll('[data-popup-closer]')
    let allOpenedPopups = document.querySelectorAll('.opened[data-popup-content]')

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

        x.classList.toggle('active')
        popup.classList.toggle('opened')
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

    if (!togglers) return

    togglers.forEach(x => x.addEventListener('click', () => {
        let content = x.querySelector('[data-content]')
        
        x.classList.toggle('opened')
        content.classList.toggle('opened')

        if (x.hasAttribute('data-shade') && window.screen.width < 768) {
            shade.classList.toggle('active')
        }

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else (content.style.maxHeight = content.scrollHeight + 'px')
    }))
}

function initFilterTogglers() {
    let overflow = document.querySelectorAll('.overflow-block')

    if (!overflow) return

    overflow.forEach(x => {
        let toggler = x.nextElementSibling

        toggler.addEventListener('click', () => {
            x.classList.toggle('opened')
            toggler.classList.toggle('opened')
        })
    })
}

// открывашка инфы в таблице
function initTableTogglers() {
    let togglers = document.querySelectorAll('[data-table-toggler]')

    if (!togglers) return

    function initTableTogglersInit() {
        if (window.screen.width > 768) {
            togglers.forEach(x => x.addEventListener('click', () => {
                let par = x.closest('[data-toggle]')
                let content = par.querySelector('[data-table-content]')

                x.classList.toggle('opened')
                par.classList.toggle('opened')
                console.log('1')

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else (content.style.maxHeight = content.scrollHeight + 'px')

                if (par.closest('[data-table-content]')) {
                    par.closest('[data-table-content]').style.maxHeight = par.closest('[data-table-content]').scrollHeight + content.scrollHeight + 'px'
                }
            }))
        } else if (window.screen.width <= 768) {
            // меняем скрипт на мобиле
            togglers.forEach(x => x.addEventListener('click', () => {
                let par = x.closest('[data-toggle]')
                let content = par.querySelector('[data-table-content]')
                let closer = par.querySelector('[data-table-closer]')

                x.classList.toggle('opened')
                par.classList.toggle('opened')
                shade.classList.add('active')
                body.classList.add('fixed')

                if (!par.closest('[data-table-content]')) {
                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    } else (content.style.maxHeight = 'calc(100vh - 200px)')
                } else {
                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    } else (content.style.maxHeight = content.scrollHeight + 'px')
                }

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

                if (closer) {
                    closer.addEventListener('click', () => {
                        closePopup()
                    })
                }
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

function initNotifications() {
    let opener = document.querySelector('[data-notifications-opener]')
    let popup = document.querySelector('[data-notifications-popup]')

    if (opener) {
        opener.addEventListener('click', (e) => {
            e.stopPropagation()
            body.classList.toggle('notify-opened')
    
            document.addEventListener('click', e => {
                if (!body.classList.contains('dashboard-page')) {
        
                    let clickInside = e.composedPath().includes(popup)
        
                    if (!clickInside) {
                        body.classList.remove('notify-opened')
                    }
                }
            })
        })
    }

    if (window.screen.width > 1620 && body.classList.contains('dashboard-page')) {
        body.classList.add('notify-opened')
    } else {
        body.classList.remove('notify-opened')
    }
    
    window.addEventListener('resize', () => {
        if (window.screen.width > 1620 && body.classList.contains('dashboard-page')) {
            body.classList.add('notify-opened')
        } else {
            body.classList.remove('notify-opened')
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

function initImporterClicks() {
    let items = document.querySelectorAll('.container-tracking li')

    if (!items) return

    let mobileBtn = document.querySelector('.mobile-status-btn')
    let close = document.querySelector('.mobile-status-close')
    let ul = document.querySelector('.container-tracking')

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
}

function initInputsWrite() {
    let holders = document.querySelectorAll('.write-input-form')

    if (!holders) return

    holders.forEach(holder => {
        let toggler = holder.querySelector('.input-readonly-write')
        let input = holder.querySelector('input')

        holder.setAttribute('data-input', input.value)
        
        toggler.addEventListener('click', () => {
            toggler.classList.add('active')

            if (input.hasAttribute('readonly')) {
                input.removeAttribute('readonly')
                input.focus()
            } else {
                toggler.classList.remove('active')
                input.setAttribute('readonly', 'readonly')
            }
        })
        
        input.addEventListener('mouseenter', () => {
            if (input.getAttribute('size') == input.value.length) {
                holder.classList.add('full')
            }
        })

        input.addEventListener('mouseleave', () => {
            if (input.getAttribute('size') == input.value.length) {
                holder.classList.remove('full')
            }
        })

        document.addEventListener('click', function closeWrites(e) {
            const clickInside = e.composedPath().includes(holder)

            if (!clickInside) {
                toggler.classList.remove('active')
                input.setAttribute('readonly', 'readonly')
                holder.setAttribute('data-input', input.value)
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
    if (!document.querySelector('#uploadImage')) return

    var myDropzone = new Dropzone("#uploadImage", {
        url: "/",
        createImageThumbnails: false,
        addRemoveLinks: true,
        dictRemoveFile: "",
        dictCancelUpload: "",
    });

    document.querySelector('button.dz-button').innerHTML = '<span class="green">Add file</span> or drop file here'
}

function initRangeInput() {
    let rangeSliders = document.querySelectorAll('.price-choose')

    if (!rangeSliders) return

    rangeSliders.forEach(x => {
        window.addEventListener('load', function(){
            slideOne();
            slideTwo();
        })

        let minimum = x.querySelector('.price-choose-inputs').getAttribute('data-min')
        let maximum = x.querySelector('.price-choose-inputs').getAttribute('data-max')
        let percentage = maximum / 100
        
        let sliderOne = x.querySelector('.range-from')
        let sliderTwo = x.querySelector('.range-to')
        let firstInput = x.querySelector('.value-from')
        let secondInput = x.querySelector('.value-to')
        let minGap = 1
        let sliderTrack = x.querySelector(".slider-track")
        let sliderMaxValue = x.querySelector('.range-from').max
        let percent1, percent2
        
        function slideOne(){
            if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
                sliderOne.value = parseInt(sliderTwo.value) - minGap;
            }
            firstInput.value = sliderOne.value * percentage;
            fillColor();
        }
        function slideTwo(){
            if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
                sliderTwo.value = parseInt(sliderOne.value) + minGap;
            }
            secondInput.value = sliderTwo.value * percentage;
            fillColor();
        }
        function fillColor(){
            percent1 = (sliderOne.value / sliderMaxValue) * 100;
            percent2 = (sliderTwo.value / sliderMaxValue) * 100;
            sliderTrack.style.background = `linear-gradient(to right, #E9F7EE ${percent1}% , #23AF53 ${percent1}% , #23AF53 ${percent2}%, #E9F7EE ${percent2}%)`;
        }

        sliderOne.value = firstInput.value / percentage
        sliderTwo.value = secondInput.value / percentage

        sliderOne.oninput = () => slideOne()
        sliderTwo.oninput = () => slideTwo()

        firstInput.onchange = () => {
            if (parseInt(firstInput.value) < parseInt(secondInput.value) && parseInt(firstInput.value) >= parseInt(minimum)) {
                sliderOne.value = firstInput.value / percentage
            } else if (parseInt(firstInput.value) >= parseInt(secondInput.value) && parseInt(firstInput.value) >= parseInt(minimum)) {
                firstInput.value = parseInt(secondInput.value) - parseInt(minGap * percentage)
                sliderOne.value = (secondInput.value / percentage) - minGap
            } else {
                firstInput.value = minimum
                sliderOne.value = minimum / percentage
            }
            fillColor()
        }

        secondInput.onchange = () => {
            if (parseInt(secondInput.value) > parseInt(firstInput.value) && parseInt(secondInput.value) <= parseInt(maximum)) {
                sliderTwo.value = secondInput.value / percentage
            } else if (parseInt(secondInput.value) <= parseInt(firstInput.value) && parseInt(secondInput.value) <= parseInt(maximum)) {
                secondInput.value = parseInt(firstInput.value) + parseInt(minGap * percentage)
                sliderTwo.value = (firstInput.value / percentage) + minGap
            } else {
                secondInput.value = maximum
                sliderTwo.value = maximum / percentage
            }
            fillColor()
        }
    })
}

function initDashboardCharts() {
    let chartsDouble = document.querySelectorAll('.diagram-chart-double')
    let chartsQuadruple = document.querySelectorAll('.diagram-chart-quadruple')

    chartsDouble.forEach(chartItem => {
        let par = chartItem.closest('.diagram-holder')
        let details = par.querySelector('.diagram-details')
        let detailItems = details.querySelectorAll('ul li')

        let sum = parseInt(detailItems[0].getAttribute('data-count')) + parseInt(detailItems[1].getAttribute('data-count'))
        par.querySelector('[data-sum-holder]').innerHTML = Intl.NumberFormat('ru-RU').format(sum);

        detailItems.forEach(x => {
            let count = x.getAttribute('data-count')

            x.querySelector('[data-count-holder]').innerHTML = '$ ' + Intl.NumberFormat('ru-RU').format(count);
        })

        const chartData = {
            labels: ['Active', 'Close'],
            data: [detailItems[0].getAttribute('data-count'), detailItems[1].getAttribute('data-count')]
        }

        new Chart(chartItem, {
            type: 'doughnut',
            data: {
                labels: chartData.labels,
                datasets: [{
                    data: chartData.data,
                    backgroundColor: [
                        'rgb(254, 209, 48)',
                        'rgb(32, 193, 223)'
                    ],
                }],
            },
            options: {
                borderWidth: 0,
                cutout: 64,
                events: [],
                plugins: {
                    legend: {
                        display: false
                    },
                }
            },
            defaults: {
                elements: {
                    bar: {
                        borderWidth: 2
                    }
                }
            }
        })
    })

    chartsQuadruple.forEach(chartItem => {
        let par = chartItem.closest('.diagram-holder')
        let details = par.querySelector('.diagram-details')
        let detailItems = details.querySelectorAll('ul li')

        let sum = parseInt(detailItems[0].getAttribute('data-count')) + parseInt(detailItems[1].getAttribute('data-count')) + parseInt(detailItems[2].getAttribute('data-count')) + parseInt(detailItems[3].getAttribute('data-count'))
        par.querySelector('[data-sum-holder]').innerHTML = Intl.NumberFormat('ru-RU').format(sum);

        detailItems.forEach(x => {
            let count = x.getAttribute('data-count')
            
            x.querySelector('[data-count-holder]').innerHTML = '$ ' + Intl.NumberFormat('ru-RU').format(count);

            if (details.classList.contains('lots')) {
                x.querySelector('[data-count-holder]').innerHTML = Intl.NumberFormat('ru-RU').format(count) + ' lots';
            }
        })

        const chartData = {
            labels: ['Active', 'Close'],
            data: [detailItems[0].getAttribute('data-count'), detailItems[1].getAttribute('data-count'), detailItems[2].getAttribute('data-count'), detailItems[3].getAttribute('data-count')]
        }

        new Chart(chartItem, {
            type: 'doughnut',
            data: {
                labels: chartData.labels,
                datasets: [{
                    data: chartData.data,
                    backgroundColor: [
                        'rgb(234, 31, 75)',
                        'rgb(254, 209, 48)',
                        'rgb(35, 175, 83)',
                        'rgb(32, 193, 223)'
                    ],
                }],
            },
            options: {
                borderWidth: 0,
                cutout: 64,
                events: [],
                plugins: {
                    legend: {
                        display: false
                    },
                }
            },
            defaults: {
                elements: {
                    bar: {
                        borderWidth: 2
                    }
                }
            }
        })
    })
}

function onScrollHandler() {
    const header = document.querySelector('header')
    let prevScroll = window.pageYOffset
    let currentScroll

    window.addEventListener('scroll', () => {

        currentScroll = window.pageYOffset

        const headerHidden = () => body.classList.contains('header-hidden')

        if (currentScroll > prevScroll && !headerHidden()) {
            body.classList.add('header-hidden')
        }
        if (currentScroll < prevScroll && headerHidden()) {
            body.classList.remove('header-hidden')
        }

        prevScroll = currentScroll
    })
}

function initNotifySlider() {
    let notificationNavs = document.querySelectorAll('.notifications-header .radio-choose li')

    if (!notificationNavs) return

    notificationNavs.forEach(x => {
        let target = x.getAttribute('data-notifications-list')
        let contentItems = document.querySelectorAll('.notifications-content .notifications-list')
        
        x.addEventListener('click', () => {
            contentItems.forEach(x => x.classList.remove('active'))
            
            Array.from(contentItems)[parseInt(target) - 1].classList.add('active')
        })

    })
}