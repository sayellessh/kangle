var company = {
    companyType: 0,
    subUrl: '',
    el: $('.company-list ul'),
    init: function (companyType) {
        company.companyType = companyType;
        if (company.companyType == 1) {
            $('.company-title .head').text('Company');
            company.getAllCompanies();
        } else if (company.companyType == 2) {
            company.getAllCompanies();
            $('.company-title .head').text('Hospital');
        } else if (company.companyType == 3) {
            company.getAllCompanies();
            $('.company-title .head').text('CME');
        }
    },
    getAllCompanies: function () {
        Services.getUserCompanies(Services.defaults.userId, company.companyType, function (data) {
            company.bindCompanies(data);
        }, function () { });
    },
    bindCompanies: function (data) {
        company.el.html('');
        company.bindCompaniesBox();
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var curCompany = data[i];
                var companyLastEl = $('li.company-item').last(), el = null;
                if (companyLastEl.size() > 0) {
                    el = companyLastEl.next('.empty-company');
                    if (el.size() == 0) {
                        company.el.append('<li class="empty-company"></li><li class="empty-company"></li><li class="empty-company"></li><li class="empty-company"></li>');
                        el = companyLastEl.next('.empty-company');
                    }
                } else {
                    el = $('li.empty-company').not('.open-lock').first();
                }
                el.html(company.getCompanyHtml(curCompany)).addClass('company-item').removeClass('empty-company');
            }
            company.el.data('companyData', data);
        }
    },
    bindCompaniesBox: function () {
        company.el.append('<li class="open-lock empty-company"><div class="lock"><div class="lock_img"></div></div><div class="value">' +
            '<input class="key-input" type="text" /><span class="company-label">Unlock Your Company</span>' +
            '</div></li>');
        for (var i = 0; i < 11; i++) {
            company.el.append('<li class="empty-company"></li>');
        }

        $('.open-lock .lock').bind('click', function () {
            $('.open-lock .key-input').show().focus();
            $('.open-lock .company-label').hide();
        });
        function resetClass() {
            $('.open-lock .lock_img').removeClass('onBlur').removeClass('onSuccess').removeClass('onError').removeClass('onType');
        }
        $('.open-lock .key-input').keyup(function (e) {
            resetClass();
            $('.open-lock .lock_img').addClass('onType');
            if (e.keyCode == 13) {
                Services.activateUserPin(Services.defaults.userId, $(this).val(), function (companyData) {
                    resetClass();
                    if (companyData.Status == 'SUCCESS') {
                        $('.open-lock .lock_img').addClass('onSuccess');
                        alert(companyData.MessageText);
                        var data = { Company_Name: companyData.data.Company_Name, Logo_Url: companyData.data.Logo_URL };
                        if (data) {
                            var allCompanies = company.el.data('companyData');
                            if (!allCompanies || allCompanies.length == 0)
                                allCompanies = new Array();
                            allCompanies.push(data);
                            company.bindCompanies(allCompanies);
                        }
                    } else {
                        alert(companyData.MessageText);
                        $('.open-lock .lock_img').addClass('onError');
                    }
                    $('.open-lock .key-input').val('').blur();
                }, function () { });
            }
            return false;
        });
        $('.open-lock .key-input').blur(function (e) {
            //$('.open-lock .lock_img').addClass('onBlur');
        });

    },
    getCompanyHtml: function (curCompany) {
        if (company.companyType == 1) {
            company.subUrl = '/CompanyHome/' + curCompany.Company_Name;
        } else if (company.companyType == 2) {
            company.subUrl = '/Hospital/HospitalPage/' + curCompany.Company_Id;
        } else if (company.companyType == 3) {
            company.subUrl = '../../Asset/AssetWeb/' + curCompany.Company_Id;
        }
        var html = '';
        html += '<a href="' + company.subUrl + '" title=""><span class="company-image"><img src="' + curCompany.Logo_Url + '" alt=""/></span>';
        html += '<span class="company-name">' + curCompany.Company_Name + '</span></a>';
        return html;
    }
};