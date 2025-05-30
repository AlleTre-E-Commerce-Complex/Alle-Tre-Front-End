import {
    WhatsappShareButton,
    FacebookShareButton,
    TwitterShareButton,
    EmailShareButton,
    WhatsappIcon,
    FacebookIcon,
    TwitterIcon,
    EmailIcon,
  } from "react-share";

export const ShareFallBack = ({shareUrl, title})=>{
    return (
        <>
                <FacebookShareButton url={shareUrl} quote={title}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <WhatsappShareButton url={shareUrl} title={title}>
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                  <TwitterShareButton url={shareUrl} title={title}>
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <EmailShareButton url={shareUrl} subject={title}>
                    <EmailIcon size={32} round />
                  </EmailShareButton>
        </>
    )
}