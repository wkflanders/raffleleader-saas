import { stripePayment } from 'wasp/client/operations';
import { TierIds, STRIPE_CUSTOMER_PORTAL_LINK } from '../../shared/constants';
import { tiers } from '../landing-page/contentSections';
import { AiFillCheckCircle } from 'react-icons/ai';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { cn } from '../../shared/utils';

const PricingPage = () => {
  const [isStripePaymentLoading, setIsStripePaymentLoading] = useState<boolean | string>(false);
  const history = useHistory();

  async function handleBuyNowClick(tierId: string) {
    try {
      setIsStripePaymentLoading(tierId);
      let stripeResults = await stripePayment(tierId);

      if (stripeResults?.sessionUrl) {
        window.open(stripeResults.sessionUrl, '_self');
      }
    } catch (error: any) {
      console.error(error?.message ?? 'Something went wrong.');
    } finally {
      setIsStripePaymentLoading(false);
    }
  }

  return (
    <div className='py-10 lg:mt-10'>
      <div className='mx-auto max-w-7xl px-10 lg:px-36'>
        <div id='pricing' className='mx-auto max-w-4xl text-center'>
          <h2 className='mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white'>
            Get <span className='text-raffleleader'>Raffle Leader</span> Now
          </h2>
        </div>
        <p className='mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-white'>
          Stripe subscriptions and secure webhooks are built-in. Just add your Stripe Product IDs! Try it out below with
          test credit card number{' '}
          <span className='px-2 py-1 bg-gray-100 rounded-md text-gray-500'>4242 4242 4242 4242 4242</span>
        </p>
        <div className='isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 lg:gap-x-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2'>
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'relative flex flex-col grow justify-between rounded-3xl ring-gray-900/10 dark:ring-gray-100/10 overflow-hidden p-8 xl:p-10 border-slate-700 border-2',
                {
                  'ring-2': tier.bestDeal,
                  'ring-1 lg:my-6': !tier.bestDeal,
                }
              )}
            >
              {tier.bestDeal && (
                <div className='absolute top-0 right-0 -z-10 w-full h-full transform-gpu blur-3xl' aria-hidden='true'>
                  <div
                    className='absolute w-full h-full bg-gradient-to-b from-raffleleader to-violet-400 opacity-15'
                    style={{
                      clipPath: 'circle(670% at 50% 50%)',
                    }}
                  />
                </div>
              )}
              <div className='mb-8'>
                <div className='flex items-center justify-between gap-x-4'>
                  <h3 id={tier.id} className='text-center text-gray-900 text-2xl font-semibold leading-8 dark:text-white'>
                    {tier.name}
                  </h3>
                </div>
                <p className='font-bold mt-4 text-3xl text-gray-600 dark:text-white'><s>{tier.description}</s></p>
                <p className='mt-6 flex items-baseline gap-x-1 dark:text-white'>
                  <span className='text-4xl font-bold tracking-tight text-gray-900 dark:text-white'>{tier.price}</span>
                  <span className='text-sm font-semibold leading-6 text-gray-600 dark:text-white'>
                    {tier.id !== TierIds.LIFETIME && '/yr'}
                  </span>
                </p>
                <ul role='list' className='mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-white'>
                  {tier.features.map((feature) => (
                    <li key={feature} className='flex gap-x-3'>
                      <AiFillCheckCircle className='h-6 w-5 flex-none text-raffleleader' aria-hidden='true' />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleBuyNowClick(tier.id)}
                aria-describedby={tier.id}
                className={cn(
                  {
                    'bg-raffleleader text-white hover:text-white shadow-sm hover:bg-raffleleader': tier.bestDeal,
                    'text-gray-600 ring-1 ring-inset ring-raffleleader hover:text-white hover:bg-raffleleader': !tier.bestDeal,
                  },
                  {
                    'cursor-wait': isStripePaymentLoading === tier.id,
                  },
                  'mt-8 block rounded-md py-2 px-3 text-center text-sm dark:text-white font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-raffleleader'
                )}
              >
                Buy Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;