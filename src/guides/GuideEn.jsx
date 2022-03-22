import React from 'react'
import BackButton from './../individuals/BackButton';
import PolicyFooter from './PolicyFooter';

function GuideEn() {
    return (
        <div className='vh-100-policy overflow-auto'>
            <div className='pb-4 mb-5 text-justify mx-2'>
                <p>Sent String is a handy and easy-to-use messenger. This is where all your data and messages are encrypted. Your email, password and name are encrypted. Nobody except you knows that you have registered with the Sent String. No personal details are required to register with Sent String, just an email or mobile phone number.</p>
                <p>All messages sent via Sent String are also encrypted. No one except you and your interlocutor knows what you are writing about, when and where the message was sent from.</p>
                <p>Instructions for registering in Sent String:</p>
                <ol>
                    <li>On the first page, click on the &quot;Register&quot; link.</li>
                    <li>Fill in the registration fields.</li>
                    <li>After filling out the form correctly, you will be redirected to the email confirmation page.</li>
                    <li>If the email was filled in correctly, you will receive an email with numbers for confirmation.</li>
                    <li>Write these numbers in the confirmation field and click &ldquo;Confirm&rdquo;.</li>
                    <li>If you did everything right, then welcome to Sent String!</li>
                </ol>
                <p>&nbsp;Instructions for using Sent String:</p>
                <ol>
                    <li>At the very top you will see: your name, the &ldquo;Chats&rdquo; link, the &ldquo;Contacts&rdquo; link and the &ldquo;Settings&rdquo; icon.
	                    <ol>
                            <li>A link with your name allows you to enter your account. Here you can see your Id and other details. Your Id is unique. You can tell your Id to friends. This will make it easier for them to find you in the Sent String user list.</li>
                            <li>In Chats you will see all your conversations. By clicking on any conversation, you are taken to the conversation itself and you can type and send messages to your interlocutor.</li>
                            <li>In Contacts you will see all your contacts. To add contacts, you need to click on the &quot;Plus&quot; icon. You will be presented with a list of Sent String users. Choose among them your acquaintances, by name or by a unique Id, and click &quot;Plus&quot; opposite their name. Now you can write messages to them. By clicking on the &quot;Minus&quot; icon, you can remove contacts from your contacts list.</li>
                            <li>&ldquo;Settings&rdquo; will allow you to change application parameters.</li>
                        </ol>
                    </li>
                    <li>All your wishes, complaints and suggestions for improving the application can be sent to e-mail at <a href="mailto:info@sentstring.com">info@sentstring.com</a>.</li>
                </ol>
                <BackButton />
            </div>
            <PolicyFooter />
        </div>
    )
}

export default GuideEn