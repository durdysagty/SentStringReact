import React from 'react'
import BackButton from './../individuals/BackButton';
import PolicyFooter from './PolicyFooter';

function CookiePolicyEn() {
    return (
        <div className='vh-100-policy overflow-auto'>
            <div className='pb-3 mb-5 text-justify mx-2'>
                <div className='w-100 text-center text-uppercase pb-2'><strong>Cookie Policy</strong></div>
                <p className='w-100 text-center pb-2'>In this policy we use the term “cookies” to refer to cookies and other similar technologies</p>
                <p className='w-100 text-center'>What Are Cookies</p>
                <p>As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or 'break' certain elements of the sites functionality.</p>
                <p>For more general information on cookies, please read <a href="https://en.wikipedia.org/wiki/HTTP_cookie">"HTTP cookie"</a>.</p>
                <p className='w-100 text-center'>How We Use Cookies</p>
                <p>We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.</p>
                <p className='w-100 text-center'>Disabling Cookies</p>
                <p>You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of the this site. Therefore it is recommended that you do not disable cookies.</p>
                <p className='w-100 text-center'>The Cookies We Set</p>
                <div>Login related cookies</div>
                <p>We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page. These cookies are typically removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in.</p>
                <div>Forms related cookies</div>
                <p>When you submit data to through a form such as those found on contact pages or comment forms cookies may be set to remember your user details for future correspondence.</p>
                <div>Site preferences cookies</div>
                <p>In order to provide you with a great experience on this site we provide the functionality to set your preferences for how this site runs when you use it. In order to remember your preferences we need to set cookies so that this information can be called whenever you interact with a page is affected by your preferences.</p>
                <p className='w-100 text-center'>Third Party Cookies</p>
                <p>In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.</p>
                <div>This site uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.</div>
                <p>For more information on Google Analytics cookies, see the official Google Analytics page.</p>
                <p>Third party analytics are used to track and measure usage of this site so that we can continue to produce engaging content. These cookies may track things such as how long you spend on the site or pages you visit which helps us to understand how we can improve the site for you.</p>
                <p>From time to time we test new features and make subtle changes to the way that the site is delivered. When we are still testing new features these cookies may be used to ensure that you receive a consistent experience whilst on the site whilst ensuring we understand which optimisations our users appreciate the most.</p>
                <div>The Google AdSense service we use to serve advertising uses a DoubleClick cookie to serve more relevant ads across the web and limit the number of times that a given ad is shown to you.</div>
                <p>For more information on Google AdSense see the official Google AdSense privacy FAQ.</p>
                <p>We use adverts to offset the costs of running this site and provide funding for further development. The behavioural advertising cookies used by this site are designed to ensure that we provide you with the most relevant adverts where possible by anonymously tracking your interests and presenting similar things that may be of interest.</p>
                <p className='w-100 text-center'>More Information</p>
                <p>Hopefully that has clarified things for you and as was previously mentioned if there is something that you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.</p>
                <p>However, if you are still looking for more information, you can contact us by email <a href="mailto:info@sentstring.com">info@sentstring.com</a>.</p>
                <BackButton />
            </div>
            <PolicyFooter />
        </div>
    )
}

export default CookiePolicyEn